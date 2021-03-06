/*
 * gestion de l'éditeur de texte pur
 * pris en charge par : Yann
 */
var text ={
    id:'text',
    sections:[],
    activeSection:null,
    color:[
        "#F0F0F0",
        "#F01000",
        "#F04000",
        "#B05000",
        "#405000",
        "#005000"
    ]
};

/*ensemble de fichier fake
 *
 */


var fran={
    ihm:[{
        comprehension:5,
        id: "titre",
        textFr:"IHM  dernier cours",
        text:"IHM  dernier cours"
    },{
        comprehension:5,
        id: "Déficiences physiques",
        textFr:["Déficiences physiques",
            "Vue et ouïe qui baissent",
            "Baisse de la coordination œil/main",
            "Arthrite et tremblements qui baissent la dextérité"
        ],
        text:["Déficiences physiques",
            "Vue et ouïe qui baissent",
            "Baisse de la coordination œil/main",
            "Arthrite et tremblements qui baissent la dextérité"
        ]
    },{
        comprehension:5,
        id: "Déficiences psychiques",
        textFr:["Déficiences psychiques",
            "Confusions",
            "Perte de mémoire",
            "Diminution dans la confiance de prise de décision",
            "Ne distinguent pas ce qui est pertinent et ce qui ne l’est pas"
        ],
        text:["Déficiences psychiques",
            "Confusions",
            "Perte de mémoire",
            "Diminution dans la confiance de prise de décision",
            "Ne distinguent pas ce qui est pertinent et ce qui ne l’est pas"
        ]
    },{
        comprehension:5,
        id: "Conséquences",
        textFr:["Conséquences",
            "Anxiété, frustration",
            "Peur de paraître stupide",
            "Peur de l’échec",
            "Peur de casser",
            "Redoute les changements"
        ],
        text:["Conséquences",
            "Anxiety, frustration",
            "Fear of looking stupid",
            "Fear of failure",
            "Peur de casser",
            "Redoute les changements"
        ]
    },{
        comprehension:5,
        id: "Problèmes",
        textFr:[
            "Problèmes",
            "Difficulté pour apprendre",
            "Manque d’intérêt"
        ],
        text:[
            "Problems",
            "Difficulty to learn",
            "Lack of interest. Merci google trad"
        ]
    },{
        comprehension:5,
        textFr:[""],
        text:[""],
    }
    ]
};


var lang;
window.onload = function() {
    lang = document.getElementById("language").value;
};


/*
 * retourne le html du composant sous la forme de string
 * utiliser une requete ajax pour charger un fichier
 * ou tapez directement le html ici
 * On peut utilisez les promises js si vous préférez
 */
text.getHTML=function(){
    string = "<div><div id=\"text_comp\"></div><div id=\"text_content\" contenteditable></div></div>";
    return string;
};

/*
 * function fake
 * devrait se connecter au serveur pour récupérer le fichier
 *
 */
text.getFile=function(name){
    return text.files[name];
};

text.load=function (name){
    text.sections=[];
    text.comp.innerHTML="";
    text.content.innerHTML="";
    var sections=text.getFile(name);
    console.log("sections",sections)
    for(var i=0;i<sections.length;i++){
        text.addSection(sections[i]);
    }
    text.activeSection="";
};

/*
 * un section est un titre si il ne comporte qu'une ligne
 */
text.addSection=function(section,afterThis){
    if(!section){
        section={
            comprehension:0,
            textFr:["."],
            text:["."]
        };
    }
    text.sections.push(section);
    var string;
    var language;
    //switch the language
    if (lang == "français" && typeof section.textFr != "undefined")
        language = section.textFr;
    else if (lang == "english" && typeof section.textEn != "undefined")
        language = section.textEn;
    else if (lang == "deutsch" && typeof section.textFr != "undefined")
        language = section.textDe;
    else
        language = section.textFr;


    var newSection=document.createElement("div");
    string = "<div id=\"" + section.id + " \">";
    if(language[0].length==1){
        string+="<h2>"+language+"</h2>";
    }else{
        string+="<h3>"+language[0]+"</h3>";
        for(var i=1;i<language.length;i++){
            string+="<p>"+language[i]+"</p>";
        }
    }
    string += "</div>";
    newSection.innerHTML=string;
    newSection.colorNode=document.createElement("div");
    newSection.colorNode.style.background=text.color[section.comprehension];
    if(afterThis){
        text.content.insertBefore(newSection, afterThis.nextSibling);
        text.comp.insertBefore(newSection.colorNode, afterThis.colorNode.nextSibling);
    }else{
        text.content.appendChild(newSection);
        text.comp.appendChild(newSection.colorNode);
    }
    return newSection;
};

text.setActiveSection=function(section){
    console.log("setActiveSection",section);
    if(text.activeSection){
      text.activeSection.style.border="";
      text.activeSection.removeChild(text.decorateChild);
    }
    text.activeSection=section;
    text.activeSection.style.border="2px solid black";
    text.activeSection.insertBefore(text.decorateChild,text.activeSection.children[0]);
    text.activeSection.focus();
};

text.handleClick=function(event){
    console.log("setActiveSection",event);
    if(event.target==text.content){
        text.addSection();
        event.target=event.target.children[0];
    }else if(event.target.tagName=='DIV'){
        text.setActiveSection(event.target);
        event.target=event.target.children[event.target.children-2];
    }else{
        text.setActiveSection(event.target.parentElement);
    }
    console.log("focus on",event.target);
    event.target.focus();
};

text.createBtn=function(recept,label,value,fct){
    var btn=document.createElement("button");
    btn.innerHTML=label;
    btn.addEventListener('click',fct,false);
    btn.comprehension=value;
    recept.appendChild(btn);
};

text.changeComp=function(event){
    if (event.stopPropagation) {
        event.stopPropagation();
    }
    event.cancelBubble = true;
    console.log("changeComp",event);
    text.activeSection.comprehension=event.target.comprehension;
    text.activeSection.colorNode.style.background=text.color[event.target.comprehension];
};

text.onKeyDown=function(event){
    console.log(event);
    if(event.ctrlKey){
        //aller a la section du dessus
        //aller a la section du dessous, si pa de section
        // retour a la première
        //creer une section
        if(event.keyCode==13){
            text.setActiveSection(
                    text.addSection(null, text.activeSection));
        }
        //mettre une note de comprehension
    }else{
        //document.activeElement
    }
};

text.afterInject=function(){
    text.comp=document.getElementById("text_comp");
    text.content=document.getElementById("text_content");
    text.load("ihm");
    init.show('text');
    text.content.addEventListener('click',text.handleClick);
    text.decorateChild=document.createElement("div");
    text.decorateChild.innerHTML="compris : ";
    text.createBtn(text.decorateChild,"pas du tout",1,text.changeComp);
    text.createBtn(text.decorateChild,"pas trop",2,text.changeComp);
    text.createBtn(text.decorateChild,"moyen",3,text.changeComp);
    text.createBtn(text.decorateChild,"plutot oui",4,text.changeComp);
    text.createBtn(text.decorateChild,"totalement",5,text.changeComp);
};








var eng={
    ihm:[{
        comprehension:5,
        id: "titre",
        textFr:"IHM  dernier cours en anglais",
        text:"IHM  dernier cours en anglais"
    },{
        comprehension:5,
        id: "Déficiences physiques",
        textFr:["Déficiences physiques",
            "Vue et ouïe qui baissent",
            "Baisse de la coordination œil/main",
            "Arthrite et tremblements qui baissent la dextérité"
        ],
        text:["Déficiences physiques",
            "Vue et ouïe qui baissent",
            "Baisse de la coordination œil/main",
            "Arthrite et tremblements qui baissent la dextérité"
        ]
    },{
        comprehension:5,
        id: "Déficiences psychiques",
        textFr:["Déficiences psychiques",
            "Confusions",
            "Perte de mémoire",
            "Diminution dans la confiance de prise de décision",
            "Ne distinguent pas ce qui est pertinent et ce qui ne l’est pas"
        ],
        text:["Déficiences psychiques",
            "Confusions",
            "Perte de mémoire",
            "Diminution dans la confiance de prise de décision",
            "Ne distinguent pas ce qui est pertinent et ce qui ne l’est pas"
        ]
    },{
        comprehension:5,
        id: "Conséquences",
        textFr:["Conséquences",
            "Anxiété, frustration",
            "Peur de paraître stupide",
            "Peur de l’échec",
            "Peur de casser",
            "Redoute les changements"
        ],
        text:["Conséquences",
            "Anxiety, frustration",
            "Fear of looking stupid",
            "Fear of failure",
            "Peur de casser",
            "Redoute les changements"
        ]
    },{
        comprehension:5,
        id: "Problèmes",
        textFr:[
            "Problèmes",
            "Difficulté pour apprendre",
            "Manque d’intérêt"
        ],
        text:[
            "Problems",
            "Difficulty to learn",
            "Lack of interest. Merci google trad"
        ]
    },{
        comprehension:5,
        textFr:[""],
        text:[""],
    }
    ]
};


var deu={
    ihm:[{
        comprehension:5,
        id: "titre",
        textFr:"IHM  dernier cours en allemand",
        text:"IHM  dernier cours en anglais"
    },{
        comprehension:5,
        id: "Déficiences physiques",
        textFr:["Déficiences physiques",
            "Vue et ouïe qui baissent",
            "Baisse de la coordination œil/main",
            "Arthrite et tremblements qui baissent la dextérité"
        ],
        text:["Déficiences physiques",
            "Vue et ouïe qui baissent",
            "Baisse de la coordination œil/main",
            "Arthrite et tremblements qui baissent la dextérité"
        ]
    },{
        comprehension:5,
        id: "Déficiences psychiques",
        textFr:["Déficiences psychiques",
            "Confusions",
            "Perte de mémoire",
            "Diminution dans la confiance de prise de décision",
            "Ne distinguent pas ce qui est pertinent et ce qui ne l’est pas"
        ],
        text:["Déficiences psychiques",
            "Confusions",
            "Perte de mémoire",
            "Diminution dans la confiance de prise de décision",
            "Ne distinguent pas ce qui est pertinent et ce qui ne l’est pas"
        ]
    },{
        comprehension:5,
        id: "Conséquences",
        textFr:["Conséquences",
            "Anxiété, frustration",
            "Peur de paraître stupide",
            "Peur de l’échec",
            "Peur de casser",
            "Redoute les changements"
        ],
        text:["Conséquences",
            "Anxiety, frustration",
            "Fear of looking stupid",
            "Fear of failure",
            "Peur de casser",
            "Redoute les changements"
        ]
    },{
        comprehension:5,
        id: "Problèmes",
        textFr:[
            "Problèmes",
            "Difficulté pour apprendre",
            "Manque d’intérêt"
        ],
        text:[
            "Problems",
            "Difficulty to learn",
            "Lack of interest. Merci google trad"
        ]
    },{
        comprehension:5,
        textFr:[""],
        text:[""],
    }
    ]
};



text.files  = fran;


init.inject(text);
