import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import '../../style/style.css'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import '../../style/style.css'
import axios from 'axios'
const defaultTest = {
     grade:null,
     target:null,
     subject:null

}
let defaultTestData = {
    grade:null,
    target:null,
    subject:null,
    questions:[{
        index:0,questionText:[],options:[]
    }]
}
class AdminPanel extends React.Component {
    constructor(props){
        super(props)
        this.state={testData:{...defaultTestData}}
    }
    Handlers={
        setQuestionText:(e,question)=>{
           let {testData} = this.state
           let questions = testData.questions
           let correspondingQuestion = questions[question.index]
           if(correspondingQuestion){
               correspondingQuestion.questionText = e.target.value
           }
           this.setState({testData})
        },
        resetTest:()=>{
            defaultTestData['questions']=[{
                index:0,questionText:[],options:[]
            }]
            this.setState({testData:defaultTestData})
        },
        submitTest:async()=>{
             let params = this.state.testData
            let url = `http://localhost:4000/createTest`
            try{
             let result = await axios.post(url,params)
             if(result.status===200){
                 alert("Your test has been submitted");
                 this.Handlers.resetTest();
             }
             else{
                 alert("Something went wrong");
             }
              }
         catch(err){
             alert("Something went wrong");
         }


        },
        setTestValue:(e)=>{
            let name = e.target.name
            let value = e.target.value
            let testData = this.state.testData
            testData[name]=value
            this.setState({testData},()=>{
                console.log('Admin panel state',this.state)
            })
            // testData
        },
        setOptionValue:(e,qIndex,opIndex)=>{

           let {testData} = this.state
           let questions = testData.questions
           let correspondingQuestion = questions[qIndex]
           if(correspondingQuestion){
            let options = correspondingQuestion.options
            let correspondingOption = options[opIndex]
            if(correspondingOption){
                correspondingOption['text'] = e.target.value
            }  
           }
           
           this.setState({testData})




        },
        addQuestionHandler:()=>{
            const defaultQuestion = {index:null,questionText:null,options:[]}
            let {testData} = this.state
            let questions=testData.questions
            defaultQuestion['index'] = testData.questions.length
            questions.push(defaultQuestion)
            this.setState({testData})
        },
        addOptionsHandler:(question)=>{

            let {testData} = this.state
            let questions = testData.questions
            let correspondingQuestion=questions[question.index]
            let defaultOption = {
                index:null,
                label:'',
                text:''
            }
            
            if(correspondingQuestion){
                let options = correspondingQuestion.options
                options.push(defaultOption)



            }
            
        this.setState({testData})

        }

    }
      
    Renderers={
        renderHeader:()=>{
            let headerButtons = []
            headerButtons.push(<Button variant="contained" color="primary">Create a Test</Button>)
            
        },
        renderQuestionInput:()=>{
              let questionElements = []
              let options = []
              let optionNums = 4
              let {testData} = this.state
              console.log('===renderQuestionInput===',testData)
              let questions = testData.questions
              
              const renderOptions = (options,qIn)=>{
                  if(options && options.length){
                    let optionElements = [] 
                    for(let [opIndex,option] of options.entries()){
                    optionElements.push(<div style={{padding:"10px"}}>
                        <input style={{marginLeft:"20px",width:"200px"}} value={option.text} type="text" id="fname" onChange={(e)=>this.Handlers.setOptionValue(e,qIn,opIndex)} name="grade" />
                       </div>)
                    }
                return <div >
                    {optionElements}
                </div>   
                }                      
              }

              
              if(questions && questions.length){
                   for(let question of questions){
                    let {options} = question
                    questionElements.push(
                       <React.Fragment>
                       <div style={{display:'flex',padding:"30px",justifyContent:"flex-start"}}>
                            <label for="fname">Question:{question.index+1}</label>
                        <TextareaAutosize rows={10} cols={60} aria-label="empty textarea" value={question.questionText} onChange={(e)=>this.Handlers.setQuestionText(e,question)} placeholder="Empty" />
                           
                        </div> 
                        <div style={{marginTop:"10px"}}>
                          <div style={{width:"50px"}}><Button onClick={()=>this.Handlers.addOptionsHandler(question)} color="primary">Add Option</Button></div>    
                       

                       {renderOptions(options,question.index)}
                  
                        </div>
                        </React.Fragment>
                        ) 
                   }

              } 
                            
              for(let i=0;i<=optionNums;i++){
              options.push(<div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-between"}}>
                  <input style={{marginLeft:"20px",width:"200px"}} type="text" id="fname" onChange={this.Handlers.setTestValue} name="grade" />
                  </div>)
              }
   
              return(<div>
                  {questionElements}
              </div>)
         },

        renderCreateTestForm:()=>{
            let testFormElements= []
            testFormElements.push(
                <div style={{display:'flex',width:"200px",justifyContent:"space-between",alignItems:"center"}}><label for="fname">Grade:</label>
                <input style={{marginLeft:"20px",width:"200px"}} type="text" id="fname"  value={this.state.testData.grade || ''}  onChange={this.Handlers.setTestValue} name="grade" key="grade" />
                </div>)
            testFormElements.push(
                <div style={{width:"200px",display:'flex',justifyContent:"space-between",alignItems:"center"}}><label for="fname">Target:</label>
                <input style={{marginLeft:"20px",width:"200px"}} type="text" id="fname" value={this.state.testData.target || ''} onChange={this.Handlers.setTestValue} name="target" key="target" />
                </div>)
                testFormElements.push(
                    <div style={{width:"200px",display:'flex',justifyContent:"space-between",alignItems:"center"}}><label for="fname">Subject:</label>
                    <input style={{marginLeft:"20px",width:"200px"}} type="text" id="fname" value={this.state.testData.subject || ''} onChange={this.Handlers.setTestValue} name="subject" key="subject" />
                    </div>)

             testFormElements.push(<div><Button onClick={this.Handlers.addQuestionHandler} color="primary">
             + Add Question
           </Button></div>)       
             testFormElements.push(this.Renderers.renderQuestionInput())
            return(<div style={{display:"flex",flexDirection:"column",justifyContent:"space-between"}}>{testFormElements}</div>)
        },
        renderCTAs:()=>{
            
            return (<div style={{display:"flex",justifyContent:"flex-start"}} >
                <div style={{marginLeft:"20px",width:"100px"}}><Button variant="contained" onClick={this.Handlers.submitTest} color="primary">
                        Submit Test
                </Button></div>
                <div style={{marginLeft:"20px",width:"100px"}}><Button variant="contained" onClick={this.Handlers.resetTest} color="primary">
                        Reset
                </Button></div>

            </div>)
            
        }
    }
    
    
    render(){
          return(<React.Fragment>
              {this.Renderers.renderHeader()}
              {this.Renderers.renderCreateTestForm()}
              {this.Renderers.renderCTAs()}
               </React.Fragment>)
        
       } 



}

export default AdminPanel;