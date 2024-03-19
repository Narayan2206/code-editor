import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import Select from "react-select";
import axios from "axios";
import Output from "./Output";
import languageOptions from "../lib/languageOptions.js";
import themeOptions from "../lib/themeOptions.js";
import editorOptions from "../lib/editorOptions.js";
import customStyles from "../lib/customStyles.js";

const defaultCode = "//Start writing your code below";
const url = import.meta.env.VITE_RAPID_API_URL;
const key = import.meta.env.VITE_RAPID_API_KEY;
const host = import.meta.env.VITE_RAPID_API_HOST;
const LS_KEY = "code";

function CodeEditor() {
  const [code, setCode] = useState(()=>{
    return JSON.parse(localStorage.getItem(LS_KEY)) || defaultCode;
  });
  const [language, setLanguage] = useState(languageOptions[0]);
  const [theme, setTheme] = useState(themeOptions[0]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [processing, setProcessing] = useState(null);
  const editorRef = useRef(null);

  //? Saves your code in local storage
  useEffect(() => {
     localStorage.setItem(LS_KEY, JSON.stringify(code));
  }, [code])
  

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    // console.log("Editor is mounted");
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    // console.log("Selected language is:", lang);
  };

  const changeTheme = (th) => {
    setTheme(th);
    // console.log("Selected theme is:", th);
  };

  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      // ** btoa(str) encodes into base64.... use atob(str) to decode
      source_code: btoa(code),
      stdin: btoa(input),
    };

    const options = {
      method: "POST",
      url: url,
      params: {
        base64_encoded: "true",
        fields: "*",
      },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Key": key,
        "X-RapidAPI-Host": host,
      },
      data: formData,
    };

    axios
      .request(options)
      .then((response) => {
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        console.log(err);
        let status = err.response?.status;
        if (status === 429) {
          console.log("Too many requests", status);
          console.log("Quota of 50 requests exceeded for the day.");
        }
        setProcessing(false);
      });

  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: `${url}/${token}`,
      params: {
        base64_encoded: "true",
        fields: "*",
      },
      headers: {
        "X-RapidAPI-Key": key,
        "X-RapidAPI-Host": host,
      },
    };

    try {
      const response = await axios.request(options);
      const statusId = response.data.status?.id;

      if (statusId === 1 || statusId === 2) {
        //* Id: 1 ---> In queue , Id: 2 ---> Processing

        // Check again after 2 seconds
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutput(response.data);
        // console.log("Compiled Successfully");
        // console.log(response.data);
        return;
      }
    } catch (error) {
      setProcessing(false);
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex gap-8 px-8 py-3 bg-zinc-950 items-center ">
        <h1 className="text-white text-2xl font-bold ">Code Editor</h1>
        <div className="w-64 ml-4">
          <Select
            defaultValue={languageOptions[0]}
            onChange={(selectedOption) => {
              changeLanguage(selectedOption);
            }}
            options={languageOptions}
            placeholder={"Select Language..."}
            styles={theme.value === "vs-dark" ? customStyles.darkMode : customStyles.lightMode}
          />
        </div>

        <div className="w-44">
          <Select
            defaultValue={themeOptions[0]}
            onChange={(selectedOption) => {
              changeTheme(selectedOption);
            }}
            options={themeOptions}
            placeholder={"Select Theme..."}
            styles={theme.value === "vs-dark" ? customStyles.darkMode : customStyles.lightMode}
          />
        </div>
      </div>
      <div className={`flex ${ theme.value === "vs-dark" ? "bg-[#1E1E1E]" : "bg-white"} max-w-full`}>
        <div className="w-[60%]">
          <Editor
            height="89vh"
            width="100%"
            className="mb-[-1px]"
            language={language?.value}
            theme={theme?.value}
            defaultValue={defaultCode}
            value={code}
            options={editorOptions}
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
          />
        </div>
        <div className="w-[40%] px-2">
          <Output output={output} theme ={theme} />
          <textarea
            name="stdin"
            id="stdin"
            placeholder="Custom Input"
            className={`block mx-2 my-3 ${ theme.value === "vs-dark" ?"bg-neutral-900 text-white": "bg-white text-black border-2 border-solid border-black shadow-[2px_2px_10px_1px_rgba(0,0,0)]"} p-2 rounded-md h-1/5 resize-y w-[97%] focus:outline-none`}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          ></textarea>
          <button
            className={`${ theme.value === "vs-dark" ? "bg-neutral-950 text-white hover:bg-neutral-800" : "border-2 border-black border-solid hover:bg-[#e0e0e0] shadow-[2px_2px_10px_1px_rgba(0,0,0)]" } p-3 mx-2 my-3 rounded-md  active:bg-neutral-900`}
            onClick={handleCompile}
            disabled={processing}
          >
            {processing ? "Processing..." : "Compile & Run"}
          </button>
        </div>
      </div>
    </>
  );
}

export default CodeEditor;
