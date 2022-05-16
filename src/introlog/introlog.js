const { spawn } = require('child_process');

const path = require('path');
const getPPI = (species,identity, coverage, evalue, intdb)=>{
let output;
// console.log(__dirname)
const arg = `/Users/naveen/Documents/web/wheatbackend/src/introlog/hpinterolog.py --blastdb "wheatblast" --ppidb "ppidb" --host_table ${species} --pathogen_table "tindicas" --host_identity ${parseInt(identity)} --host_coverage ${parseInt(coverage)} --host_evalue ${parseFloat(evalue)} --pathogen_identity ${parseInt(identity)} --pathogen_coverage ${parseInt(coverage)} --pathogen_evalue ${parseFloat(evalue)} --ppitables ${intdb}`
console.log(arg)  
const intrdb = intdb.split(",")

console.log(intrdb)

const getS = spawn('python3', ["/Users/naveen/Documents/web/wheatbackend/src/introlog/hpinterolog.py", "--blastdb", "wheatblast", "--ppidb", "ppidb", "--host_table", species, "--pathogen_table", "tindicas", "--host_identity", parseInt(identity), "--host_coverage", parseInt(coverage) ,"--host_evalue", parseFloat(evalue), "--pathogen_identity", parseInt(identity) ,"--pathogen_coverage", parseInt(coverage) ,"--pathogen_evalue", parseFloat(evalue) ,"--ppitables", intdb]);
// const getS = spawn('python3', [arg])

getS.stdout.on('data', (data) => {

    
    output = data.toString();

    // console.log('output was generated: ' + output);
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


