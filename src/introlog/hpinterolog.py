from pymongo import MongoClient
import pandas as pd
import argparse
import time


ver= '0.0.1'

parser = argparse.ArgumentParser(description="""hpinterolog {} : a python based interolog based host-pathogen identification package""".format(ver),
usage="""%(prog)s [options]""",
epilog="""Written by Naveen Duhan (naveen.duhan@usu.edu),
Kaundal Bioinformatics Lab, Utah State University,
Released under the terms of GNU General Public Licence v3""",    
formatter_class=argparse.RawTextHelpFormatter )

parser.add_argument("--version", action="version", version= 'pyseqrna (version {})'.format(ver), help= "Show version information and exit")
parser.add_argument("--method", dest='method',help="method")
parser.add_argument("--blastdb", dest='blastdb',help="Host and Pathogen Blast files database")
parser.add_argument("--ppidb", dest='ppidb', help="Interolog host pathogen interactions database")
parser.add_argument("--host_table", dest='hosttable', help="Host blast result table")
parser.add_argument("--out", dest='out', help="Outfile for results")
parser.add_argument("--pathogen_table", dest='pathogentable', help="Pathogen blast result table")
parser.add_argument("--host_identity", dest='hi', type=int, help="Host identitiy for blast filter")
parser.add_argument("--host_coverage", dest='hc',type=int, help="Host coverage for blast filter")
parser.add_argument("--host_evalue", dest='he', type=float, help="Host evalue for blast filter")
parser.add_argument("--pathogen_identity", dest='pi',type=int, help="Pathogen identitiy for blast filter")
parser.add_argument("--pathogen_coverage", dest='pc',type=int, help="Pathogen coverage for blast filter")
parser.add_argument("--pathogen_evalue", dest='pe', type=float, help="Pathogen evalue for blast filter")
parser.add_argument('--id', dest='idt', type=str, help="Id type [host, pathogen]" )
parser.add_argument('--genes', dest='genes', type=str, help="Genes ids to search")
parser.add_argument('--ppitables', dest='ppitables', type=str, default='all', 
    help="""Provide space separated interaction database names. For example hpidb mint 
""")


def connection(db):
    client = MongoClient("mongodb://localhost:27017/")

    connectDB = client[db]

    return connectDB


def filter_blast(db, table,  ident, cov, eval, interologdb, genes=None):
    mydb = connection(db)
    mtable = mydb[table]
    if genes !=None:
        results = list(mtable.find({ 'qseqid': {'$in':genes},'pident':{'$gte':ident},'qcovs':{'$gte':cov},'evalue':{'$lte':eval}
        , 'intdb':interologdb}))
    else:
        results = list(mtable.find({'pident':{'$gte':ident},'qcovs':{'$gte':cov},'evalue':{'$lte':eval}
        , 'intdb':interologdb}))

    df= pd.DataFrame(results)
    return df


def ppi(intdb, pathogendf, hostdf):  
    pp =connection('ppidb')
    ptable = pp[intdb]
    pathogen_list = pathogendf['sseqid'].values.tolist()
    host_list = hostdf['sseqid'].values.tolist()
    # define query here
    query = {
        '$and': [
        { '$or': [ { 'ProteinA': { '$in' : pathogen_list } }, { 'ProteinB' : { '$in': host_list } } ] },
        { '$or': [ { 'ProteinA': { '$in' : host_list } }, { 'ProteinB' : { '$in': pathogen_list } } ] }
    ]

    }
    # Search in database

    result = list(ptable.find(query))

    # convert to Dataframe

    results = pd.DataFrame(result)

    # Extract Host and Pathogen IDs

    # For host as interactor A and Pathogen as Interactor B

    hostA= hostdf[['qseqid', 'sseqid','intdb']]
    pathogenB = pathogendf[['qseqid', 'sseqid','intdb']]
    hostA.columns=['Host_Protein', 'ProteinA', 'intdb']
    pathogenB.columns=['Pathogen_Protein','ProteinB', 'intdb']
    
    # For host as interactor B and Pathogen as Interactor A

    hostB= hostdf[['qseqid', 'sseqid','intdb']]
    pathogenA = pathogendf[['qseqid', 'sseqid','intdb']]
    hostB.columns=['Host_Protein', 'ProteinB', 'intdb']
    pathogenA.columns=['Pathogen_Protein','ProteinA', 'intdb']

    # Merge ppis and blast

    resultA = results.merge(hostA, on=['ProteinA'])
    resultsA = resultA.merge(pathogenB, on=['ProteinB'])

    resultB = results.merge(hostB, on=['ProteinB'])
    resultsB = resultB.merge(pathogenA, on=['ProteinA'])

    # finally merge resultsA and resultsB

    final = pd.concat([resultsA, resultsB], axis=0)

    final_results = final[['Host_Protein', 'Pathogen_Protein', 'ProteinA', 'ProteinB', 'intdb_x', 'Method', 'Type', 'Confidence', 'PMID']]
    
    # remove duplicate values

    final_results = final_results.drop_duplicates()

    return final_results

def filter_domain(db, table, genes=None):
    mydb = connection(db)
    mtable = mydb[table]

    if genes !=None:
        results = list(mtable.find({'query_name': {'$in':id}}))
    else:
        results = list(mtable.find({}))

    df= pd.DataFrame(results)
    return df

def domain(intdb, pathogendf,hostdf):
    pp =connection('ppidb')
    ptable = pp[intdb]
    pathogen_list = pathogendf['accessionT'].values.tolist()
    host_list = hostdf['accessionT'].values.tolist()
    # define query here
    query = {
        '$and': [
        { '$or': [ { 'ProteinA': { '$in' : pathogen_list } }, { 'ProteinB' : { '$in': host_list } } ] },
        { '$or': [ { 'ProteinA': { '$in' : host_list } }, { 'ProteinB' : { '$in': pathogen_list } } ] }
    ]

    }
    # Search in database

    result = list(ptable.find(query))

    # convert to Dataframe

    results = pd.DataFrame(result)


    hostA = hostdf[['accessionT', 'query_name']]
    
    pathogenB = pathogendf[['accessionT', 'query_name']]
    hostA.columns =['ProteinA', 'Host_Protein']
    # print(hostA)
    pathogenB.columns = ['ProteinB', 'Pathogen_Protein']

    # For host as interactor B and Pathogen as Interactor A

    hostB= hostdf[['accessionT', 'query_name']]
    pathogenA = pathogendf[['accessionT', 'query_name']]
    hostB.columns= ['ProteinB', 'Host_Protein']
    pathogenA.columns= ['ProteinA', 'Pathogen_Protein']

    # Merge ppis and blast

    resultA = results.merge(hostA, on=['ProteinA'])
    resultsA = resultA.merge(pathogenB, on=['ProteinB'])

    resultB = results.merge(hostB, on=['ProteinB'])
    resultsB = resultB.merge(pathogenA, on=['ProteinA'])

    final = pd.concat([resultsA, resultsB], axis=0)
    
    final_results = final[['Host_Protein', 'Pathogen_Protein', 'ProteinA', 'ProteinB', 'Score', 'DomainA_name', 'DomianA_desc',
       'DomainA_interpro', 'DomainB_name', 'DomianB_desc', 'DomainB_interpro',
       'intdb']]
    
    final_results = final_results.drop_duplicates()

    return final_results

def add_results(data):
    pp =connection('kbunt_results')
    name = round(time.time() * 1000)+'_results'
    ptable = pp[name]
    ptable.insert_many(data)

    return name

def add_noresults(data):
    pp =connection('kbunt_results')
    name = f"kbunt{str(round(time.time() * 1000))}results"
    ptable = pp[name]
    ptable.insert_one({'result':data})

    return name

def main():

    options, unknownargs = parser.parse_known_args()
    
    results_list ={}

    intTables = options.ppitables.split(",")
    
    hproteins = None
    pproteins = None
    
    if options.idt == 'host':
        if options.genes:
            hproteins = options.genes.replace(' ','').split(",")
        
    if options.idt == 'pathogen':
        if options.genes:
            pproteins = options.genes.replace(' ','').split(",")
        
    if options.method == 'interolog':
        for hpd in intTables:

            host_blast = filter_blast(options.blastdb,options.hosttable,options.hi,options.hc,options.he,hpd, genes=hproteins)
            pathogen_blast = filter_blast(options.blastdb,options.pathogentable,options.pi,options.pc,options.pe,hpd, genes=pproteins)
            hd =hpd+'s'
        
            if  isinstance(pathogen_blast, pd.DataFrame) and isinstance(host_blast, pd.DataFrame):
                results = ppi(hd,pathogen_blast,host_blast)
                results.reset_index(inplace=True, drop=True)
                results_list[hpd]=results
            else:
                rid= "no results"
    if options.method == 'domain':
        for hpd in intTables:

            host_blast = filter_domain(options.blastdb,options.hosttable, genes=hproteins)
            pathogen_blast = filter_domain(options.blastdb,options.pathogentable, genes=pproteins)
            hd =hpd+'s'
        
            
            results = domain(hd,pathogen_blast,host_blast)
            results.reset_index(inplace=True, drop=True)
            results_list[hpd]=results
                
            
            

    
    try:
        final = pd.concat(results_list.values(),ignore_index=True)

        final.reset_index(inplace=True, drop=True)
        rid = add_results(final.to_dict('records'))

        print(rid)
    except Exception:
        rid = add_noresults("no results")
        print(rid)

if __name__ == '__main__':
    main()





