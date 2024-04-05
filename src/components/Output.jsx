import React from "react";

function Output({output, theme}) {
const darkStyle = "bg-neutral-900 text-white";
const lightStyle = "bg-white text-black border-2 border-solid border-black shadow-[2px_2px_10px_1px_rgba(0,0,0)]";


  const getOutput = ()=>{
    let statusId = output?.status?.id;

     if( statusId === 6 ){
        //* Compilation Error
        return (
            <pre>
              {atob(output?.compile_output)}
            </pre>
        );
     }
     else if( statusId === 3){
      //* Accepted
      return (
          // If output is not null, then display decoded output otherwise display null
        <pre>
          {atob(output?.stdout) !== null ? `${atob(output?.stdout)}` : null }
        </pre>
    );
     }
     else if( statusId === 5) {
         //* Time limit exceeded
         return (
          <pre>
            {`Time Limit Exceeded.`}
          </pre>
         );
     }
     else{
      //* Other errors like Runtime errors
      return(
          <pre>
         { atob(output?.stderr) }
        </pre>
      );
     }
  }


  return (
    <>
    <h2 className={`text-xl font-bold m-3 ${ theme.value === "vs-dark" ? "text-white" : "text-black"}`} >Output:</h2>
      <div
        className={`rounded-md my-3 text-sm ${ theme.value === "vs-dark" ? darkStyle : lightStyle} mx-2 h-32  p-2 overflow-y-auto lg:h-1/3`}
        >
        {output? getOutput() : null}
      </div>
    </>
  );
}

export default Output;
