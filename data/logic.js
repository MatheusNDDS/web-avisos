//// PROGRAM DATA ////
const timeIndex = 4
const style = document.documentElement.style
var defaultEvent = ["Evento", '#005a5c', "--:--", "#008080","0" ]
var uiState = '-edit'
// UI
const addBtn = document.getElementById('addBtn')
const expBtn = document.getElementById('ExpBtn')
const impBtn = document.getElementById('ImpBtn')
const editBtn = document.getElementById('EditBtn')
const Slide = document.getElementById('Slide')
const editBtnIcon = document.getElementById('EditBtnIcon')
const modDialog = document.getElementById('ModDialog')
const sidePanel = document.getElementById('ui')
//Entries
const dayEntry = document.getElementById('DayEntry')
const cardHeight = document.getElementById('CardHeight')
const fontSize = document.getElementById('FontSize')
const modMenu = document.getElementById('ModMenu')
const viewsForm = document.getElementById('ViewsForm')
const viewMode = document.getElementsByName("VM")
const radios = document.forms[0].elements["VM"]
const impTrigger = document.getElementById('ImpTrigger')
const slideTitle = document.getElementById('SlideTitle')
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
const views = ['Semana','Amanhã', 'Hoje', 'Modelos']
// Try restore storage
var Data = JSON.parse(localStorage.getItem('Data'))
// Setup Data
if (Data == undefined || Data == null){
    Data = {
        "Events" : {"Segunda": [],"Terça": [],"Quarta": [],"Quinta": [],"Sexta": [],"Sábado": [],"Domingo": [],"Amanhã" : [], "Hoje" : []},
        "Settings" : {"css" : {}},
    }
}
var eventData = Data.Events
var settingsData = Data.Settings

//// Functions ////
function eventMn(cmd,day,eventIndex,value,dataIndex,tagId){
    switch (cmd) {
        case '-add':
            if (modMenu.value == '' && settingsData.slide_view !== "Modelos"){
                alert('Sem modelos para aplicar, vá na visualização de modelos e crie um.')
            }else if (settingsData.slide_view == "Modelos"){
                    var template = Array.from(defaultEvent)
                    eventData[day].push(template)
            }else{
                eventData.Modelos.forEach(element =>{
                    var template = Array.from(element)

                    if (modMenu.value == template[0]){
                        console.log(`${template[0]} :: ${modMenu.value}`)
                        eventData[day].push(template)
                        settingsData.last_event = template[0]
                    }
                })
            }
            menuUpdate();saveData();buildUi3()
        return;break
        case '-rm':
            eventData[day].splice(eventIndex,1)
            buildUi3()
        return;break
        case '-update':
            let values = eventData[day]
            let event = values[eventIndex]
            event[dataIndex] = value

            if (tagId != null) { tagId.style.setProperty('background', `${event[dataIndex]}`)}
            timeParse(day,eventIndex,event[dataIndex])

            menuUpdate();saveData()
        return;break
        case '-sort':
            Object.keys(eventData).forEach(key => {
                eventData[key] = eventData[key].sort((a, b) => { return a[4] - b[4] })
            })
            buildUi3()
        return;break
    }
}
function fileMn(cmd,content,filename){
    switch (cmd){
        case '-up':
            const json = JSON.parse(content)
            if (json.Events != undefined | json.Events != null &&
                json.Events.Segunda != undefined | json.Events.Segunda != null &&
                json.Events.Terça != undefined | json.Events.Terça != null &&
                json.Events.Quarta != undefined | json.Events.Quarta != null &&
                json.Events.Quinta != undefined | json.Events.Quinta != null &&
                json.Events.Sexta != undefined | json.Events.Sexta != null &&
                json.Events.Sábado != undefined | json.Events.Sábado != null &&
                json.Events.Domingo != undefined | json.Events.Domingo != null &&
                json.Events.Modelos != undefined | json.Events.Modelos != null &&
                json.Settings != undefined | json.Settings != null &&
                json.Settings.css != undefined | json.Settings.css != null)
            {
                Data = json
                eventData = Data.Events
                settingsData = Data.Settings
                saveData();buildUi3();styleMn('-restore')
            }else{
                if (json.Segunda != undefined | json.Segunda != null &&
                    json.Terça != undefined | json.Terça != null &&
                    json.Quarta != undefined | json.Quarta != null &&
                    json.Quinta != undefined | json.Quinta != null &&
                    json.Sexta != undefined | json.Sexta != null &&
                    json.Sábado != undefined | json.Sábado != null &&
                    json.Domingo != undefined | json.Domingo != null &&
                    json.Modelos != undefined | json.Modelos != null)
                {
                    eventData = json
                    saveData();buildUi3()
                }else{
                    alert('Arquivo de eventos invállido!')
                }
            }
            break;
        case '-dl':
            const json_txt = JSON.stringify(content)
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(json_txt));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
            break;
    }
}
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
    eventMn('-sort')
}
function buildUi3(){
    Object.keys(eventData).forEach(key => {
        const values = eventData[key]
        if (values.length == 0){weekMap[key].Container.innerHTML='<Evento class="ph">-</Evento>'}else{weekMap[key].Container.innerHTML=''}
        for (const i in values){
            let event = values[i]
            if (values.length != 0 && values != null){
                let card = `<Leiaute id="Lay${key}${i}"><Cartão id="Card${key}${i}" style="background-color: ${event[1]};">
                                <input id="Name${key}${i}" class="Titulo event" type="text" onchange=(eventMn('-update',"${key}",${i},this.value,0,null)) value="${event[0]}">
                                <input  id="Hour${key}${i}" class="Hora event" type="time" style="background-color: ${event[3]};" onchange=(eventMn('-update',"${key}",${i},this.value,2,null)) value="${event[2]}">
                            </Cartão>
                            <div class="edit"><span class="edit">
                                    <input id="NameColor${key}${i}" onchange="eventMn('-update','${key}',${i},this.value,1,Card${key}${i})" class="button card edit" type="color" value="${event[1]}">
                                    <input id="HourColor${key}${i}" onchange="eventMn('-update','${key}',${i},this.value,3,Hour${key}${i})" class="button card edit" type="color" value="${event[3]}">
                                    <button class="button card edit" onclick="eventMn('-rm','${key}',${i})" ><i class="fa fa-trash"></i></button>
                            </span></div></Leiaute>`
                weekMap[key].Container.innerHTML+= card
                timeParse(key,i,event[2])
            }
        }
        if (values.length > 0 ){
            weekMap[key].Container.style.setProperty('background', '#838383')
        }else{
            weekMap[key].Container.style.setProperty('background', '#00000000')
        }
        if (values.length > 1 && settingsData.slide_view == "Semana") {
            weekMap[key].Container.style.setProperty('border-left', `5pt  black solid`)
            weekMap[key].Container.style.setProperty('border-right', `5pt  black solid`)
        }else{
            weekMap[key].Container.style.setProperty('border-left', '0pt  #40404000 solid')
            weekMap[key].Container.style.setProperty('border-right', '0pt  #40404000 solid')
        }
    })
    saveData(); menuUpdate()
}
function menuUpdate(){
    last_event = settingsData.last_event
    modMenu.options.length = 0

    eventData.Modelos.forEach((element) =>{
        modMenu.options[modMenu.options.length] = new Option(element[0], `${element[0]}`);
        if (last_event != null && last_event != undefined && element[0] == last_event){
                modMenu.value = last_event
        }
    })
}
function saveData(){
    const wadata = {
        "Events" : eventData,
        "Settings" : settingsData,
    }
    localStorage.setItem('Data',JSON.stringify(wadata))
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
        case '-save':
            settingsData.css[key] = [value , type]
        break;
        case '-restore':
            cssData = settingsData.css
            Object.keys(cssData).forEach(key => {
                let values = cssData[key]
                style.setProperty(`--${key}`.replace('_','-'),`${values[0]}${values[1]}`)
            })
            setupEntries()
        break;
        case '-set':
            cssData = settingsData.css
            values = cssData[key]
            style.setProperty(`--${key}`.replace('_','-'), `${values[0]}${values[1]}`)
        break;
    }
    saveData()
}
function setupEntries(){
    values = settingsData
    cssData = settingsData.css

    if(cssData.card_height != undefined){cardHeight.value = cssData.card_height[0]}
    if(cssData.font_size != undefined){fontSize.value = cssData.font_size[0]}
    if(values.slide_title != undefined | values.slide_title != null){slideTitle.value = values.slide_title}
    if(values.slide_view != undefined){
        viewMode.forEach((element) => {if (element.value == values.slide_view) element.checked = true})
    }

    // renames the “Amanhã” label for my especial use case
    tomDayLabel = document.getElementById('TomDayLabel')
    if(values.tom_day_label != undefined | values.tom_day_label != null){tomDayLabel.innerHTML = values.tom_day_label}
}
function slideViewUpdate(){
    buildUi3()
    if(settingsData.slide_view == undefined){settingsData.slide_view = 'Semana'}
    const value = settingsData.slide_view

    views.forEach((element)=>{
        if (value == element){
            document.getElementById(element).style.display = 'block'
        }
        else{
            document.getElementById(element).style.display ='none'
        }
    })

    if(value == 'Semana'){dayEntry.disabled = false}else{dayEntry.disabled = true}
    if(value == 'Modelos'){
        document.getElementById('DinAdd').innerHTML = 'Novo Modelo'
        modMenu.disabled = true
    }else{
        document.getElementById('DinAdd').innerHTML = 'Novo Evento'
        modMenu.disabled = false

    }

    setupEntries();saveData()
}
function setup(){
/// Backward compatibility
    //Data storage refactoring
    oldEvents = JSON.parse(localStorage.getItem('eventData'))
    oldSettings = JSON.parse(localStorage.getItem('settingsData'))
    if (oldEvents != undefined | oldEvents != null){
        eventData = oldEvents
        saveData();buildUi3()
        localStorage.removeItem('eventData')
    }
    if (oldSettings != undefined | oldSettings != null){
        settingsData = oldSettings
        saveData();buildUi3()
        localStorage.removeItem('settingsData')
    }

    //Simple faisafe
    if (settingsData.css == undefined){settingsData.css = {}}
    if (eventData.Amanhã == undefined){eventData.Amanhã = []}
    if (eventData.Hoje == undefined){eventData.Hoje = []}
    if (eventData.Modelos == undefined){eventData.Modelos = [defaultEvent]}
/// General Setup
    settingsData.last_event = null
    firstModel = eventData.Modelos[0]
    if (firstModel[0] != defaultEvent[0] ) {console.log('TODO')}
}
//// Listeners ////
addBtn.addEventListener('click',function(){
    if (settingsData.slide_view == "Semana"){
        eventMn('-add',dayEntry.value)
    }else{
        eventMn('-add',settingsData.slide_view)
    }
    buildUi3()
})
cardHeight.addEventListener('change',function(){
    styleMn('-save',"card_height",parseInt(this.value),'px')
    styleMn('-set',"card_height")
})
slideTitle.addEventListener('change',function(){
    settingsData.slide_title = this.value
    saveData()
})
fontSize.addEventListener('change',function(){
    styleMn('-save',"font_size",parseInt(this.value),'px')
    styleMn('-set',"font_size")
})
editBtn.addEventListener('click', function(){
    uiUpdate('-ui');eventMn('-sort')
})
viewsForm.addEventListener('click', function(){
    viewMode.forEach((element) =>{
        if (element.checked == true){
            console.log(element.value)
            settingsData.slide_view = element.value
            slideViewUpdate()
        }
    })
})
impBtn.addEventListener('click', function(){
    impTrigger.click()
})
expBtn.addEventListener('click', function(){
    fileMn('-dl',Data,`Eventos.json`)
})
impTrigger.addEventListener('change',  function(){
    var eventsFile = this.files[0]
    console.log(eventsFile)
    var fileReader = new FileReader()
    if (eventsFile) {
        fileReader.readAsText(eventsFile,"UTF-8")
        fileReader.onload = function(loadedFile){
            fileMn('-up',loadedFile.target.result,null)
            impTrigger.value = null
        }
    }
})
//// Main Space ////
setup(); styleMn('-restore'); eventMn('-sort'); slideViewUpdate()
