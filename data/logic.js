//// PROGRAM DATA ////
const timeIndex = 4
const style = document.documentElement.style
var uiState = '-edit'
// UI
const addBtn = document.getElementById('addBtn')
const Slide = document.getElementById('Slide')
const editBtn = document.getElementById('EditBtn')
const editBtnIcon = document.getElementById('EditBtnIcon')
//Entries
const dayEntry = document.getElementById('DayEntry')
const CardHeight = document.getElementById('CardHeight')
const viewMode = document.getElementById('ViewMode')
//Week html map
const WeekMap = {
    "Segunda": {
        "Master": document.getElementById("segMaster"),
        "Container": document.getElementById("segCont"),
    },
    "Terça": {
        "Master": document.getElementById("terMaster"),
        "Container": document.getElementById("terCont"),
    },
    "Quarta": {
        "Master": document.getElementById("quaMaster"),
        "Container": document.getElementById("quaCont"),
    },
    "Quinta": {
        "Master": document.getElementById("quiMaster"),
        "Container": document.getElementById("quiCont"),
    },
    "Sexta": {
        "Master": document.getElementById("sixMaster"),
        "Container": document.getElementById("sixCont"),
    },
    "Sábado": {
        "Master": document.getElementById("sabMaster"),
        "Container": document.getElementById("sabCont"),
    },
    "Domingo": {
        "Master": document.getElementById("domMaster"),
        "Container": document.getElementById("domCont"),
    },
}

//// Storage Setup ////
const defaultEvent = ["EVENTO", '#6a2c05', "00:00", "#32160a","0" ]
//Events
var eventData = JSON.parse(localStorage.getItem('eventData'))
if (eventData == undefined || eventData == null ){var eventData = {
        "Segunda": [],
        "Terça": [],
        "Quarta": [],
        "Quinta": [],
        "Sexta": [],
        "Sábado": [],
        "Domingo": [],
    }
}
//Settings
var settingsData = JSON.parse(localStorage.getItem('settingsData'))
if (settingsData == undefined){var settingsData = {"css" : {}}}
if (settingsData.css == undefined){settingsData.css = {}}

//// Functions ////
function UiUpdate(cmd){
    console.log(uiState)
    switch(cmd){
        case '-ui':
            switch(uiState){
            case '-view':
                style.setProperty('--ui-display','none')
                style.setProperty('--ui-span-display','none')
                style.setProperty('--edit-btn-bg','none')
                editBtnIcon.classList.add('fa-edit');editBtnIcon.classList.remove('fa-check')
                uiState = '-edit'
            break;
            case '-edit':
                style.setProperty('--ui-display','flex')
                style.setProperty('--ui-span-display','absolute')
                style.setProperty('--edit-btn-bg','lightgray')
                editBtnIcon.classList.add('fa-check');editBtnIcon.classList.remove('fa-edit')
                uiState = '-view'
            break;
        }
        break;
    }
    EventSort()
}
function buildUi3(){
    Object.keys(eventData).forEach(key => {
        let values = eventData[key] // Sort a array from fullTimeStr
        if (values == ''){
            WeekMap[key].Container.innerHTML='<Evento class="ph">-</Evento>'

        }else{
            WeekMap[key].Container.innerHTML=''
        }
        //console.log(key)
        for (const i in values){
            let event = values[i]
            if (values != []){
                let card = `<Leiaute><Cartão id="Card${key}${i}" style="background-color: ${event[1]};">
                                <input id="Name${key}${i}" class="Titulo event" type="text" onchange=(EventUpdate("${key}",${i},this.value,0)) value="${event[0]}">
                                <input  id="Hour${key}${i}" class="Hora event" type="time" style="background-color: ${event[3]};" onchange=(EventUpdate("${key}",${i},this.value,2,null)) value="${event[2]}">
                            </Cartão>
                            <span class="edit">
                                    <input id="NameColor${key}${i}" onchange="EventUpdate('${key}',${i},this.value,1,Card${key}${i})" class="button card edit" type="color" value="${event[1]}">
                                    <input id="HourColor${key}${i}" onchange="EventUpdate('${key}',${i},this.value,3,Hour${key}${i})" class="button card edit" type="color" value="${event[3]}">
                                    <button class="button card edit" onclick="EventRemove('${key}',${i})" ><i class="fa fa-trash"></i></button>
                            </span></Leiaute>`
                WeekMap[key].Container.innerHTML+= card
                TimeParse(key,i,event[2])
            }
        }
    })
    SaveData()
}
function AddEvent(day){
    if (dayEntry.value == ''){
        alert('Tem que prencher todos os campos aí, não é mesmo? 1')
    }else {
        eventData[day].push(["EVENTO", '#6a2c05', "00:00", "#32160a","0" ])
        SaveData()
    }
}
function EventRemove(day,eventIndex){
    eventData[day].splice(eventIndex,1)
    buildUi3()
}
function EventUpdate(day,eventIndex,value,dataIndex,tagId){
    let values = eventData[day]
    let event = values[eventIndex]
    event[dataIndex]=value

    if ( tagId != null){ tagId.style.setProperty('background', `${event[dataIndex]}`)}
    
    TimeParse(day,eventIndex,event[dataIndex])
    SaveData()
}
function SaveData(){
    localStorage.setItem('eventData',JSON.stringify(eventData))
    localStorage.setItem('settingsData',JSON.stringify(settingsData))
}
function TimeParse(day,eventIndex,timeStr){
        let events = eventData[day]
        let event = events[eventIndex]
        let fullTimeStr = `${timeStr}.00`

        event[timeIndex] = toMS(fullTimeStr)
}
function toMS(str) {
    if(!str.includes(":"))
       return parseFloat(str);
    const [mins, secms] = str.split(":");
    const [sec, ms] = secms.split(".");
    return ((+mins * 60) + +sec) * 1000 + +ms;
}
function EventSort(){
    Object.keys(eventData).forEach(key => {
        eventData[key] = eventData[key].sort((a, b) => { return a[4] - b[4] })
    })
    buildUi3()
}
function StyleMg(cmd,key,value,type,master){
    switch (cmd){
        case 'save':
            settingsData.css[key] = [value , type]
        break;
        case 'restore':
            cssData = settingsData.css
            Object.keys(cssData).forEach(key => {
                let values = cssData[key]
                style.setProperty(`--${key}`.replace('_','-'),`${values[0]}${values[1]}`)
            })
            setupEntries()
        break;
        case 'set':
            cssData = settingsData.css
            values = cssData[key]
            style.setProperty(`--${key}`.replace('_','-'), `${values[0]}${values[1]}`)
        break;
    }
}
function setupEntries(){
    values = settingsData
    cssData = settingsData.css
    if(cssData.card_height != undefined){CardHeight.value = cssData.card_height[0]}
    if(values.slide_view != undefined){viewMode.value = values.slide_view}

}
function SlideViewUpdate(){
    if(settingsData.slide_view == null){settingsData.slide_view = 'Semana'}
    const value = settingsData.slide_view
    const views = ['Semana','Amanhã', 'Hoje']

    views.forEach((element)=>{
        if (value == element){
            document.getElementById(element).style.display='block'
        }
        else{
            document.getElementById(element).style.display='none'
        }
    })

    setupEntries()
}
//// Logic ////
addBtn.addEventListener('click',function(){
    dayTarget = dayEntry.value
    
    AddEvent(dayTarget)
    buildUi3()
})
CardHeight.addEventListener('change',function(){
    StyleMg("save","card_height",parseInt(this.value),'px')
    StyleMg("set","card_height")
})
editBtn.addEventListener('click', function(){UiUpdate('-ui')})
viewMode.addEventListener('change', function(){
    settingsData.slide_view = this.value
    SlideViewUpdate(this.value)
})
//// Exec Space ////
EventSort();StyleMg('restore');SlideViewUpdate()
