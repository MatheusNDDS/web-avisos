//// PROGRAM DATA ////
const timeIndex = 4
const style = document.documentElement.style
var defaultEvent = ["Evento", '#999999', "--:--", "#008080","0" ]
var uiState = '-edit'
// UI
const addBtn = document.getElementById('addBtn')
const Slide = document.getElementById('Slide')
const editBtn = document.getElementById('EditBtn')
const editBtnIcon = document.getElementById('EditBtnIcon')
const modDialog = document.getElementById('ModDialog')
const sidePanel = document.getElementById('ui')
//Entries
const dayEntry = document.getElementById('DayEntry')
const cardHeight = document.getElementById('CardHeight')
const viewMode = document.getElementById('ViewMode')
const modMenu = document.getElementById('ModMenu')
//Week html map
const weekMap = {
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
    "Amanhã": {
        "Master": document.getElementById("TomMaster"),
        "Container": document.getElementById("TomCont"),
    },
    "Hoje": {
        "Master": document.getElementById("TodMaster"),
        "Container": document.getElementById("TodCont"),
    },
    "Modelos": {
        "Master": document.getElementById("ModMaster"),
        "Container": document.getElementById("ModCont"),
    },
}
// Try restore storage
var eventData = JSON.parse(localStorage.getItem('eventData'))
var settingsData = JSON.parse(localStorage.getItem('settingsData'))
// Setup Storage
if (eventData == undefined || eventData == null ){
    var eventData = {"Segunda": [],"Terça": [],"Quarta": [],"Quinta": [],"Sexta": [],"Sábado": [],"Domingo": [],"Amanhã" : [], "Hoje" : []}
}
if (settingsData == undefined){var settingsData = {"css" : {}}}


//// Functions ////
function uiUpdate(cmd){
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
    eventSort()
}
function buildUi3(){
    Object.keys(eventData).forEach(key => {
        let values = eventData[key] // Sort a array from fullTimeStr
        if (values == ''){weekMap[key].Container.innerHTML='<Evento class="ph">-</Evento>'}else{weekMap[key].Container.innerHTML=''}
        // console.log(key)
        for (const i in values){
            let event = values[i]
            if (values != []){
                let card = `<Leiaute id="Lay${key}${i}"><Cartão id="Card${key}${i}" style="background-color: ${event[1]};">
                                <input id="Name${key}${i}" class="Titulo event" type="text" onchange=(eventUpdate("${key}",${i},this.value,0,null)) value="${event[0]}">
                                <input  id="Hour${key}${i}" class="Hora event" type="time" style="background-color: ${event[3]};" onchange=(eventUpdate("${key}",${i},this.value,2,null)) value="${event[2]}">
                            </Cartão>
                            <span class="edit">
                                    <input id="NameColor${key}${i}" onchange="eventUpdate('${key}',${i},this.value,1,Card${key}${i})" class="button card edit" type="color" value="${event[1]}">
                                    <input id="HourColor${key}${i}" onchange="eventUpdate('${key}',${i},this.value,3,Hour${key}${i})" class="button card edit" type="color" value="${event[3]}">
                                    <button class="button card edit" onclick="eventRemove('${key}',${i})" ><i class="fa fa-trash"></i></button>
                            </span></Leiaute>`
                weekMap[key].Container.innerHTML+= card
                timeParse(key,i,event[2])
            }
            if (values.length > 1 ) {
                document.getElementById(`Lay${key}${i}`).style.setProperty('border-left', `3pt  #404040 solid`)

            }
        }
    })
    saveData(); menuUpdate()
}
function addEvent(day){
    if (modMenu.value == '' && settingsData.slide_view !== "Modelos"){
        alert('Sem modelos para aplicar, vá na visualização de modelos e crie um.')
    }else{
        if (settingsData.slide_view == "Modelos"){
            var template = Array.from(defaultEvent)
            eventData[day].push(template)
        }else{
            eventData.Modelos.forEach(element =>{
                var template = Array.from(element)

                if (modMenu.value == template[0]){
                    console.log(`${template[0]} :: ${modMenu.value}`)
                    eventData[day].push(template)
                }
            })
        }
    }
    menuUpdate();saveData()
}
function menuUpdate(){
    modMenu.options.length = 0
    eventData.Modelos.forEach((element) =>{
        modMenu.options[modMenu.options.length] = new Option(element[0], `${element[0]}`);
    })
}
function eventSort(){
    Object.keys(eventData).forEach(key => {
        eventData[key] = eventData[key].sort((a, b) => { return a[4] - b[4] })
    })
    buildUi3()
}
function eventRemove(day,eventIndex){
    eventData[day].splice(eventIndex,1)
    buildUi3()
}
function eventUpdate(day,eventIndex,value,dataIndex,tagId){
    let values = eventData[day]
    let event = values[eventIndex]
    event[dataIndex]=value

    if ( tagId != null){ tagId.style.setProperty('background', `${event[dataIndex]}`)}
    
    timeParse(day,eventIndex,event[dataIndex])
    menuUpdate();saveData()
}
function saveData(){
    localStorage.setItem('eventData',JSON.stringify(eventData))
    localStorage.setItem('settingsData',JSON.stringify(settingsData))
}
function timeParse(day,eventIndex,timeStr){
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
function styleMn(cmd,key,value,type,master){
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
    if(cssData.card_height != undefined){cardHeight.value = cssData.card_height[0]}
    if(values.slide_view != undefined){viewMode.value = values.slide_view}
}
function slideViewUpdate(){
    if(settingsData.slide_view == undefined){settingsData.slide_view = 'Semana'}
    const value = settingsData.slide_view
    const views = ['Semana','Amanhã', 'Hoje', 'Modelos']

    views.forEach((element)=>{
        if (value == element){
            document.getElementById(element).style.display = 'block'
        }
        else{
            document.getElementById(element).style.display ='none'
        }
    })

    if(value == 'Semana'){
        dayEntry.disabled = false
    }else{
        dayEntry.disabled = true
    }

    setupEntries()
}
function backCompat(){
    if (settingsData.css == undefined){settingsData.css = {}}
    if (eventData.Amanhã == undefined){eventData.Amanhã = []}
    if (eventData.Hoje == undefined){eventData.Hoje = []}
    if (eventData.Modelos == undefined){eventData.Modelos = [defaultEvent]}
}
//// Interactivity ////
addBtn.addEventListener('click',function(){
    if (settingsData.slide_view == "Semana"){
        addEvent(dayEntry.value)
    }else{
        addEvent(settingsData.slide_view)
    }
    buildUi3()
})
cardHeight.addEventListener('change',function(){
    styleMn("save","card_height",parseInt(this.value),'px')
    styleMn("set","card_height")
})
editBtn.addEventListener('click', function(){uiUpdate('-ui')})
viewMode.addEventListener('change', function(){
    settingsData.slide_view = this.value
    slideViewUpdate(this.value)
})

//// Main Space ////
backCompat(); styleMn('restore'); eventSort(); slideViewUpdate()
