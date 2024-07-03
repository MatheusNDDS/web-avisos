//// PROGRAM DATA ////
const timeIndex = 4,
      style = document.documentElement.style,
      views = ['Semana','Amanhã', 'Hoje', 'Modelos']

var defaultEvent = ["Evento", '#005a5c', "--:--", "#008080","0" ],
    uiState = '-view'
// UI
const addBtn = document.getElementById('addBtn'),
      expBtn = document.getElementById('ExpBtn'),
      impBtn = document.getElementById('ImpBtn'),
      editBtn = document.getElementById('EditBtn'),
      editBtnIcon = document.getElementById('EditBtnIcon'),
      sidePanel = document.getElementById('ui')
//Entries
const dayEntry = document.getElementById('DayEntry'),
      cardHeight = document.getElementById('CardHeight'),
      fontSize = document.getElementById('FontSize'),
      titleSize = document.getElementById('TitleSize'),
      modMenu = document.getElementById('ModMenu'),
      viewsForm = document.getElementById('ViewsForm'),
      viewMode = document.getElementsByName("VM"),
      radios = document.forms[0].elements["VM"],
      impTrigger = document.getElementById('ImpTrigger'),
      slideTitle = document.getElementById('SlideTitle')

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
//Setup data
var Data = JSON.parse(localStorage.getItem('Data'))
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
                    let template = Array.from(defaultEvent)
                    eventData[day].push(template)
            }else{
                for (let key in eventData.Modelos){
                    let template = Array.from(eventData.Modelos[key])
                    if (modMenu.value == template[0]){
                        eventData[day].push(template)
                        settingsData.last_event = template[0]
                    }
                }
            }
            menuUpdate();saveData();buildUi3()
        break
        case '-rm':
            eventData[day].splice(eventIndex,1)
            buildUi3()
        break
        case '-update':
            let dayEvents = eventData[day]
            let event = dayEvents[eventIndex]
            event[dataIndex] = value

            if (tagId != null) {tagId.style.setProperty('background', `${event[dataIndex]}`)}

            timeParse(day,eventIndex,event[dataIndex])
            menuUpdate();saveData()
        break
        case '-sort':
            for (let key in eventData){
                eventData[key] = eventData[key].sort((a, b) => { return a[4] - b[4] })
            }
            buildUi3()
        break
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
    switch(uiState){
        case '-view':
            style.setProperty('--ui-display','none')
            style.setProperty('--ui-span-display','none')
            style.setProperty('--edit-btn-bg','none')
            style.setProperty('--slide-highlight','var(--slide-font-shadow)')
            editBtnIcon.classList.add('fa-edit')
            editBtnIcon.classList.remove('fa-check')
            uiState = '-edit'
        break;
        case '-edit':
            style.setProperty('--ui-display','flex')
            style.setProperty('--ui-span-display','absolute')
            style.setProperty('--edit-btn-bg','var(--light-accent)')
            style.setProperty('--slide-highlight','var(--slide-font-shadow), 0px 0px 10px var(--light-accent)')
            editBtnIcon.classList.add('fa-check')
            editBtnIcon.classList.remove('fa-edit')
            uiState = '-view'
        break;
    }
}
function buildUi3(){
    for (let key in eventData){
        let Events = eventData[key]
        if (Events.length == 0){weekMap[key].Container.innerHTML='<Evento class="ph">-</Evento>'}else{weekMap[key].Container.innerHTML=''}
        for (const i in Events){
            let event = Events[i]
            if (Events.length != 0 && Events != null){
                let card = `<Leiaute id="Lay${key}${i}"><Cartão id="Card${key}${i}" style="background-color: ${event[1]};">
                                <input id="Name${key}${i}" class="Titulo event" type="text" onchange=(eventMn('-update',"${key}",${i},this.value,0,null)) value="${event[0]}">
                                <input  id="Hour${key}${i}" class="Hora event" type="time" style="background-color: ${event[3]};" onchange=(eventMn('-update',"${key}",${i},this.value,2,null)) value="${event[2]}">
                            </Cartão>
                            <div class="edit"><span class="edit">
                                    <input id="NameColor${key}${i}" title="Fundo do título" onchange="eventMn('-update','${key}',${i},this.value,1,Card${key}${i})" class="button card edit" type="color" value="${event[1]}">
                                    <input id="HourColor${key}${i}" title="Fundo da hora" onchange="eventMn('-update','${key}',${i},this.value,3,Hour${key}${i})" class="button card edit" type="color" value="${event[3]}">
                                    <button class="button card edit" title="Excluir" onclick="eventMn('-rm','${key}',${i})" ><i class="fa fa-trash"></i></button>
                            </span></div></Leiaute>`
                weekMap[key].Container.innerHTML+= card
                timeParse(key,i,event[2])
            }
        }
        if (Events.length > 0){
            weekMap[key].Container.style.setProperty('background', '#838383')
        }else{
            weekMap[key].Container.style.setProperty('background', '#00000000')
        }
        if (Events.length > 1 && settingsData.slide_view == "Semana") {
            weekMap[key].Container.style.setProperty('border-left', `5pt  black solid`)
            weekMap[key].Container.style.setProperty('border-right', `5pt  black solid`)
        }else{
            weekMap[key].Container.style.setProperty('border-left', '0pt  #40404000 solid')
            weekMap[key].Container.style.setProperty('border-right', '0pt  #40404000 solid')
        }
    }
    saveData(); menuUpdate()
}
function menuUpdate(){
    let lastEvent = settingsData.last_event
    modMenu.options.length = 0
    models = eventData.Modelos

    for (let key in models){
        let element = models[key]
        modMenu.options[modMenu.options.length] = new Option(element[0], `${element[0]}`);
        if (lastEvent != null && lastEvent != undefined && element[0] == lastEvent){
            modMenu.value = lastEvent
        }
    }
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
        let fullTimeStr = `${timeStr}.00`
        event = events[eventIndex]
        event[timeIndex] = toMS(fullTimeStr)
}
function toMS(str) {
    if (! str.includes(":")) {return parseFloat(str)}
    const [mins, secms] = str.split(":")
    const [sec, ms] = secms.split(".")
    return ((+mins * 60) + +sec) * 1000 + +ms
}
function styleMn(cmd,key,value,type,master){
    let cssVars = settingsData.css
    let cssValues = cssVars[key]

    switch (cmd){
        case '-save':
            settingsData.css[key] = [value , type]
        break;
        case '-restore':
            for (let key in cssVars){
                cssValues = cssVars[key]
                style.setProperty(`--${key}`.replace('_','-'),`${cssValues[0]}${cssValues[1]}`)
            }
            setupEntries()
        break;
        case '-set':
            style.setProperty(`--${key}`.replace('_','-'), `${cssValues[0]}${cssValues[1]}`)
        break;
    }
    saveData()
}
function setupEntries(){
    let settings = settingsData
    let cssVars = settingsData.css

    if (cssVars.card_height != undefined) {cardHeight.value = cssVars.card_height[0]}
    if (cssVars.title_size != undefined) {titleSize.value = cssVars.title_size[0]}
    if (cssVars.font_size != undefined) {fontSize.value = cssVars.font_size[0]}
    if (settings.slide_title != undefined | settings.slide_title != null) {slideTitle.value = settings.slide_title}
    if (settings.slide_view != undefined) {viewMode.forEach((element) => {if (element.value == settings.slide_view) element.checked = true})}

    // renames the “Amanhã” label for my especial use case
    tomDayLabel = document.getElementById('TomDayLabel')
    if (settings.tom_day_label != undefined | settings.tom_day_label != null) tomDayLabel.innerHTML = settings.tom_day_label
}
function slideViewUpdate(){
    let view = settingsData.slide_view
    for (let key in views) {
        if (view == views[key]){
            document.getElementById(views[key]).style.display = 'block'
        }else{
            document.getElementById(views[key]).style.display ='none'
        }
    }
    if (view == 'Semana') {dayEntry.disabled = false} else {dayEntry.disabled = true}
    if (view == 'Modelos'){
        document.getElementById('DinAdd').innerHTML = 'Novo Modelo'
        modMenu.disabled = true
    }else{
        document.getElementById('DinAdd').innerHTML = 'Novo Evento'
        modMenu.disabled = false
    }
}
function setup(){
/// Backward compatibility
    //Data storage refactoring (Everting went wrong during test stage.)
    oldEvents = JSON.parse(localStorage.getItem('eventData'))
    oldSettings = JSON.parse(localStorage.getItem('settingsData'))
    firstModel = eventData.Modelos[0]

    if (oldEvents != undefined | oldEvents != null){
        eventData = oldEvents
        firstModel = eventData.Modelos[0]
        if (eventData.Modelos == undefined){eventData.Modelos = [defaultEvent]}
        if (eventData.Amanhã == undefined){eventData.Amanhã = []}
        if (eventData.Hoje == undefined){eventData.Hoje = []}
        if (firstModel[0] != defaultEvent[0]) {console.log('TODO')}
        saveData();buildUi3()
        localStorage.removeItem('eventData')
    }
    if (oldSettings != undefined | oldSettings != null){
        settingsData = oldSettings
        settingsData.last_event = null
        if (settingsData.slide_view == undefined){settingsData.slide_view = "Semana"}
        if (settingsData.css == undefined){settingsData.css = {}}
        saveData();buildUi3()
        localStorage.removeItem('settingsData')
    }

    //Simple faisafe
    if (settingsData.slide_view == undefined){settingsData.slide_view = "Semana"}
    if (settingsData.css == undefined){settingsData.css = {}}
    if (eventData.Amanhã == undefined){eventData.Amanhã = []}
    if (eventData.Hoje == undefined){eventData.Hoje = []}
    if (eventData.Modelos == undefined){eventData.Modelos = [defaultEvent]}

/// General Setup
    settingsData.last_event = null

/// Starting functions
    styleMn('-restore'); eventMn('-sort'); uiUpdate(); slideViewUpdate()
    style.setProperty('opacity',1) // Prevent visual gliches when JS change css style during setup.
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
titleSize.addEventListener('change',function(){
    styleMn('-save',"title_size",parseInt(this.value),'px')
    styleMn('-set',"title_size")
})
editBtn.addEventListener('click', function(){
    uiUpdate();eventMn('-sort')

})
viewsForm.addEventListener('click', function(){
    for (let key in viewMode){
        let element = viewMode[key]
        if (element.checked == true){
            settingsData.slide_view = element.value
            slideViewUpdate()
        }
    }
})
impBtn.addEventListener('click', function(){
    impTrigger.click()
})
expBtn.addEventListener('click', function(){
    fileMn('-dl',Data,`Eventos.json`)
})
impTrigger.addEventListener('change',  function(){
    let eventsFile = this.files[0]
    let fileReader = new FileReader()
    if (eventsFile) {
        fileReader.readAsText(eventsFile,"UTF-8")
        fileReader.onload = function(loadedFile){
            fileMn('-up',loadedFile.target.result,null)
            impTrigger.value = null
        }
    }
})

//// Main Space ////
setup()
