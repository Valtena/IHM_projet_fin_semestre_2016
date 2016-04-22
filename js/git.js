/*
 * gestion du systeme de versionnig git
 * pris en charge par : Aristide et Rémy
 */
var git ={
    id:'git'
};

//var user = {Aristide, Quentin, Rémy, Yann};

/*
 * retourne le html du composant sous la forme de string
 * utiliser une requete ajax pour charger un fichier
 * ou tapez directement le html ici
 * On peut utilisez les promises js si vous préférez
 */
git.getHTML=function(){
    var string = "<input type=\"text\" id=\"git init\" placeholder=\"Nom du repository\">";
    string += "<button id=\"init\"> Git init </button>  <span id=\"error_init\" class=\"error\"></span> <span id=\"right_init\" class=\"right\">  </span>    <br />";
    string += "<input type=\"text\" id=\"git commit\" placeholder=\"Nom du commit\">";
    string += "<button id=\"commit\" disabled=\"disabled\"> Commit </button>    <span id=\"error_commit\" class=\"error\"></span>   <span id=\"right_commit\" class=\"right\"></span>   <br />";
    string += "Fichier partagé avec : <select id=\"usersShare\" size =\"1\"></select><br />";
    string += "<input type=\"text\" id=\"user\" list=\"usersList\" placeholder=\"ex: user4\">";
    string += "<datalist id=\"usersList\"></datalist>";
    string += "<button id=\"addUsertoShare\"> Ajout </button>";
    string += "<button id=\"delUsertoShare\"> Suppression </button><span id=\"error_add/del\" class=\"error\"></span>   <span id=\"right_add/del\" class=\"right\"></span><br />";
    string += "<button id=\"droits\"> Gérer les droits </button><br />";

    return string;
};

init.inject(git);

//All the variables
var initButton = document.getElementById("init");
var initText = document.getElementById("git init");
var commitButton = document.getElementById("commit");
var commitText = document.getElementById("git commit");
var shareButton = document.getElementById("share");
var droitButton = document.getElementById("droit");
var error_init = document.getElementById("error_init");
var error_commit = document.getElementById("error_commit");
var right_init = document.getElementById("right_init");
var right_commit = document.getElementById("right_commit");
var error_add_del = document.getElementById("error_add/del");
var right_add_del = document.getElementById("right_add/del");
var usersShare = document.getElementById("usersShare");
var usersList = document.getElementById("usersList");
var user = document.getElementById("user");
var addUsertoShare = document.getElementById("addUsertoShare");
var delUsertoShare = document.getElementById("delUsertoShare");
var users = ["user1", "user2", "user3", "groupe1"];
var allUsers = ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "groupe1", "groupe2", "groupe3"];

//hide the textbox for commit
commitText.style.visibility = "hidden";

//action when click on the button git init
function submitGitInit(){
    var right = document.getElementById("true_init");
    if(initText.value == ""){
        error_init.innerHTML = "Le nom du repository ne peut-être vide";
        return;
    }
    error_init.innerHTML = "";
    right_init.innerHTML = "Le dépôt a bien été créé.";
    initText.style.visibility = "hidden";
    commitText.style.visibility = "visible";
    initButton.disabled = "disabled";
    commitButton.disabled = "";
}
initButton.addEventListener("click", submitGitInit, false);

//action when click on the button git commit
function submitGitCommit(){
    right_init.innerHTML = "";
    if(commitText.value == ""){
        error_commit.innerHTML = "Le message du commit ne peut-être vide";
        return;
    }
    error_commit.innerHTML = "";
    right_commit.innerHTML = "Le commit a bien été effectué.";
    initText.style.visibility = "hidden";
    commitText.style.visibility = "visible";
    initButton.disabled = "disabled";
    commitButton.disabled = "";
}
commitButton.addEventListener("click", submitGitCommit, false);

//put the users into the select
function usersIntoSelect(select) {
    select.innerHTML = "";
    for(var i = 0;i<users.length;i++)
        select.innerHTML += "<option>" + users[i];
}
usersIntoSelect(usersShare);

//put all the users into the dataList
function addUsersToDataList(datalist){
    datalist.innerHTML = "";
    for(var i = 0;i<allUsers.length;i++)
        datalist.innerHTML += "<option value=\"" + allUsers[i] + "\"/>";
}
addUsersToDataList(usersList);

//add a User to the usersShare
function addUser() {
	if(allUsers.indexOf(user.value) != -1){
		if(users.indexOf(user.value) == -1){
			users.push(user.value);
			usersIntoSelect(usersShare);
			right_add_del.innerHTML = user.value+" a bien été ajouté.";
            error_add_del.innerHTML = "";
		}else{
            right_add_del.innerHTML = "";
			error_add_del.innerHTML = user.value+" a déjà accès à ce fichier."
		}
	}else{
        right_add_del.innerHTML = "";
		error_add_del.innerHTML = user.value+" n'existe pas!";
	}
}
addUsertoShare.addEventListener("click", addUser, false);

//del a User to the usersShare
function delUser(){
    if(allUsers.indexOf(user.value) != -1){
        if(users.indexOf(user.value) == -1){
            right_add_del.innerHTML = "";
            error_add_del.innerHTML = user.value+" n'a pas accès à ce fichier.";
        } else {
            users.splice(users.indexOf(user.value),1);
            usersIntoSelect(usersShare);
            right_add_del.innerHTML = user.value+" a bien été supprimé.";
            error_add_del.innerHTML = "";
        }
    }else {
        right_add_del.innerHTML = "";
        error_add_del.innerHTML = user.value + " n'existe pas";
    }
}
delUsertoShare.addEventListener("click", delUser, false);
