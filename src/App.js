  /*global chrome*/
import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from 'react-bootstrap/Button';
import styles from './App.css'

const App = () => {
  const [formValues, setFormValues] = useState([{ text: ""}])
  let ipynb = ({nbformat: 4, nbformat_minor: 0, metadata: {}})
  useEffect(() =>{
    // store into storage in case extension closes
    chrome.storage.local.get(['data'], function(result) {
      if(result.data && !formValues[0].text) {
        setFormValues(result.data)
      }
      else if (formValues[0].text){
    chrome.storage.local.set({data: formValues}, function() {
      console.log(formValues)})
      }})
  }, [formValues])

  function handleButton(){
    chrome.storage.local.get(["allContent", "allStyle", "allType"], function(data) {
      console.log("Getting data from storage...");
      if (data) {
        let tmpStyle = JSON.parse(data.allStyle[0]);
        console.log(data.allContent)
        setFormValues([...formValues, { text: data.allContent[0]}]);
        // let tmpStyle = data.allStyle[0];
        console.log(tmpStyle);
        // style code temp commented out
        // let finalStyle = "";
        // for (const [key, value] of Object.entries(tmpStyle)) {
        // if (!Number.isNaN(key)) {
        //     continue;
        // }
        // console.log(key +'='+'"'+value+'"');
        // finalStyle += (key + ': ' + value + '; ');
        // snippet.style.setProperty(key, value);
      }
      // console.log(finalStyle);
      // snippet.style.cssText = finalStyle;
      // snippet.setAttribute("style", finalStyle);
      // snippet.setAttribute("style", JSON.parse(data.allStyle[0]));
      // Object.assign(snippet.style, JSON.parse(data.allStyle[0]))
      // snippet.style.cssText = JSON.parse(data.allStyle[0]);
      // console.log(JSON.parse(data.allStyle[0]));
      // console.dir(snippet);
    })

  }

  function download(fileName, contentType) {
    let dictforcells = {cells: []};
    console.log(formValues)
    for(const element of formValues) {
      console.log(element)
      let markdown = {cell_type: 'markdown', metadata: {collapsed: 'false'}, source: element.text.split('\n')} //split returns an array even with no delimiters
      markdown.source.forEach((element, index, array) => {
        array[index] = element + '\n'
      })
      dictforcells.cells.push(markdown)
    }
    ipynb.cells = dictforcells.cells
    let content = JSON.stringify(ipynb)
    let a = document.createElement("a");
    let file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i]['text'] = e.target.value;
    setFormValues(newFormValues);
    console.log(ipynb)
  }

  let addFormFields = () => {
    setFormValues([...formValues, { text: "" }])
  }

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues)
  }

  return (
      <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
      >
        {formValues.map((element, index) => (
            <div className="form-inline" key={index}>
              <TextField
                  id="outlined-multiline-flexible"
                  label="markdown"
                  value={element.text || ""}
                  multiline
                  maxRows={4}
                  className={styles.textbox}
                  onChange={e => handleChange(index, e)}
              />
              {
                index ?
                    <Button variant="danger" onClick={() => removeFormFields(index)}>Remove</Button>
                    : null
              }
            </div>

        ))}
        <div className="button-section">
          <Button variant='success' type="button" onClick={() => addFormFields()}>Add</Button>
          <Button
              variant='info'
              className={styles.buttonDownload}
              onClick={ ()=>{download('jupyter_notes.ipynb' ,'application/json')}}
          >
            {`Download ipynb`}
          </Button>
          <Button className="update_button" variant='outline-success' onClick={handleButton}> Update</Button>
        </div>
      </Box>
  )
}

export default App
