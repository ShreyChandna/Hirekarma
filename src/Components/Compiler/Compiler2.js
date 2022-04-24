import React,{useState} from 'react'
import './Compiler2.css'
import ProgressModal from '../ProgressModal'
import {BsQuestion} from 'react-icons/bs'
import {GrCode} from 'react-icons/gr'
import {RiFileCodeFill} from 'react-icons/ri'

const Compiler2 = () => {
    const [code,setCode]=useState('');
    const [input,setInput]=useState('');
    const[openModal,setOpenModal]=useState(false);

    const openModalHandler=()=>{
      setOpenModal(true);
    }

    const inputHandler=(event)=>{
      setInput(event.target.value);
    }

    const codeHandler=(event)=>{
        setCode(event.target.value);
    }
    

    const codeSubmitHandler = async (e) => {
      e.preventDefault();
      let outputText = document.getElementById("output");
      outputText.innerHTML = "";
      outputText.innerHTML += "Creating Submission ...\n";
      const response = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          method: "POST",
          headers: {
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key": "94b475ec9emsh55e6ca06218f4fep112d7djsn672f4a23e235", // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
            "content-type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            source_code:code,
            stdin: input,
            language_id: 50,
          }),
        }
      );
      outputText.innerHTML += "Submission Created ...\n";

      const jsonResponse = await response.json();
        console.log(jsonResponse);
      let jsonGetSolution = {
        status: { description: "Queue" },
        stderr: null,
        compile_output: null,
      };
  
      while (
        jsonGetSolution.status.description !== "Accepted" &&
        jsonGetSolution.stderr == null &&
        jsonGetSolution.compile_output == null
      ) {
        outputText.innerHTML = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`;
        if (jsonResponse.token) {
          let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;
  
          const getSolution = await fetch(url, {
            method: "GET",
            headers: {
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
              "x-rapidapi-key": "94b475ec9emsh55e6ca06218f4fep112d7djsn672f4a23e235", // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
              "content-type": "application/json",
            },
          });
  
          jsonGetSolution = await getSolution.json();
          console.log(jsonGetSolution);
        }
      }
      if (jsonGetSolution.stdout) {
        const output = atob(jsonGetSolution.stdout);
  
        outputText.innerHTML = "";
        setOpenModal(false);
        outputText.innerHTML += `Results :\n${output}\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`;
      } else if (jsonGetSolution.stderr) {
        const error = atob(jsonGetSolution.stderr);
  
        outputText.innerHTML = "";
  
        outputText.innerHTML += `\n Error :${error}`;
      } else {
        const compilation_error = atob(jsonGetSolution.compile_output);
  
        outputText.innerHTML = "";
  
        outputText.innerHTML += `\n Error :${compilation_error}`;
      }
    };
  return (
      <>
      {openModal && <ProgressModal />}
       <h1>ONLINE C COMPILER</h1>
      <div className='items'>
  
    <div className="card">
      <div style={{display:"flex"}}>
    Question: <BsQuestion className='ques' />
    </div>
        <div className="card-body">
         Write a program in C to take an integer from the user as an input and print its factorial
        </div>
       
    </div>
    
   <form id="form" onSubmit={codeSubmitHandler}>
    <div className="form-group">
  <label htmlFor="exampleFormControlTextarea1" className='label-1'>Code Here <GrCode /></label>
  <textarea className="form-control rounded-0" id="exampleFormControlTextarea1" rows="10" onChange={codeHandler}  placeholder='Enter Your Code here'>
  </textarea>
</div>
<button  type="submit" className="btn btn-primary" onClick={openModalHandler}>Run</button>
</form>
<div className="form-group">
  <label htmlFor="exampleFormControlTextarea2" className='label-1'>Output <RiFileCodeFill /></label>
  <textarea className="form-control rounded-0" id="output" rows="10"  placeholder='Output will appear here' readOnly> 
  </textarea>
</div>
  </div>
  <div className="form-group">
  <textarea className="form-control2 rounded-0" id="exampleFormControlTextarea1" rows="10" onChange={inputHandler} placeholder="Enter Input here"></textarea>
</div>


   

    </>
  )
}

export default Compiler2
