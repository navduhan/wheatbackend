const { spawn } = require('child_process');

const path = require('path');
const getPPI = (method, hspecies, pspecies,identity, coverage, evalue, pi, pc, pe, intdb,domdb, genes, idt)=>{
let output;
let getS;
console.log("/opt/web/wheatbackend/src/introlog/hpinterolog.py", "--method", method, "--blastdb", "wheatblast", "--ppidb", "ppidb", "--host_table", hspecies, "--pathogen_table", pspecies, "--host_identity", parseInt(identity), "--host_coverage", parseInt(coverage) ,"--host_evalue", parseFloat(evalue), "--pathogen_identity", parseInt(pi) ,"--pathogen_coverage", parseInt(pc) ,"--pathogen_evalue", parseFloat(pe) ,"--ppitables", intdb, '--id', idt, '--genes', genes)
if (genes.length >0){
    getS = spawn('/opt/miniconda3/envs/mlgpu/bin/python3', ["/opt/web/kbunt/wheatbackend/src/introlog/hpinterolog.py", "--method", method, "--blastdb", "wheatblast", "--ppidb", "ppidb", "--host_table", hspecies, "--pathogen_table", pspecies, "--host_identity", parseInt(identity), "--host_coverage", parseInt(coverage) ,"--host_evalue", parseFloat(evalue), "--pathogen_identity", parseInt(pi) ,"--pathogen_coverage", parseInt(pc) ,"--pathogen_evalue", parseFloat(pe) ,"--ppitables", intdb, '--domdb', domdb, '--id', idt, '--genes', genes]);

}
else{
getS = spawn('/opt/miniconda3/envs/mlgpu/bin/python3', ["/opt/web/kbunt/wheatbackend/src/introlog/hpinterolog.py", "--method", method, "--blastdb", "wheatblast", "--ppidb", "ppidb", "--host_table", hspecies, "--pathogen_table", pspecies, "--host_identity", parseInt(identity), "--host_coverage", parseInt(coverage) ,"--host_evalue", parseFloat(evalue), "--pathogen_identity", parseInt(pi) ,"--pathogen_coverage", parseInt(pc) ,"--pathogen_evalue", parseFloat(pe) ,"--ppitables", intdb,  '--domdb', domdb,]);
}

getS.stdout.on('data', (data) => {

    output = data.toString();

    console.log('output was generated: ' + output);
});

getS.stdin.setEncoding = 'utf-8';

getS.stderr.on('data', (data) => {
    
    console.log('error:' + data);
});
return new Promise((res, rej) => {

    getS.stdout.on('end', async function (code) {

    const rid = output.split('\n')
    console.log(rid[0])
    res(rid[0])
    })
 });

}

module.exports = getPPI


