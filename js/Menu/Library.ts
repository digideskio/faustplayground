/*				LIBRARY.JS
	Creates Graphical Library of Faust Modules
	Connects with faust.grame.fr to receive the json description of available modules

	Interface structure
	===================
	DIV --> PARENT
		DIV --> libraryDiv
			DIV --> libraryTitle
			DIV --> imageNode
			DIV --> fFooter
			UL --> section 1
				LI --> subsection 1
				LI --> subsection 2
				etc
			UL --> section 2
				LI --> subsection 1
				LI --> subsection 2
				etc
	===================

	The library Div gets opened when passed over with the mouse

	DEPENDENCIES :
		- faust.grame.fr/www/pedagogie/index.json
*/

//--- Init graphical elements of library

/// <reference path="../App.ts"/>
/// <reference path="../Main.ts"/>


interface IImageNode extends HTMLImageElement {
    state: string;
    section: string;
    folder: HTMLUListElement;
}
interface jsonObjectLibrary {
    instrument: string;
    effet: string;
    exemple: string;
    instrumentSupprStructure: string;
    effetSupprStructure: string;
    exempleSupprStructure: string;
    instruments: string[];
    effets: string[];
    exemples: string[];
}


class Library{
    libraryView: LibraryView;

    fillLibrary() {
        var url: string = "faust-modules/index.json"
        App.getXHR(url, (json: string) => { this.fillLibraryCallBack(json) }, (errorMessage: string) => { ErrorFaust.errorCallBack(errorMessage)});
    }

    fillLibraryCallBack(json: string) {
        var jsonObject: jsonObjectLibrary = JSON.parse(json);
        jsonObject.effet = "effetLibrarySelect";
        jsonObject.effetSupprStructure = "faust-modules/effects/";
        jsonObject.instrument = "instrumentLibrarySelect";
        jsonObject.instrumentSupprStructure = "faust-modules/generators/";
        jsonObject.exemple = "exempleLibrarySelect";
        jsonObject.exempleSupprStructure = "faust-modules/combined/";
        this.fillSubMenu(jsonObject.instruments, jsonObject.instrument, jsonObject.instrumentSupprStructure);
        this.fillSubMenu(jsonObject.effets, jsonObject.effet, jsonObject.effetSupprStructure);
        this.fillSubMenu(jsonObject.exemples, jsonObject.exemple, jsonObject.exempleSupprStructure);

    }

    fillSubMenu(options: string[], subMenuId: string, stringStructureRemoved: string) {
        var subMenu: HTMLUListElement = <HTMLUListElement>document.getElementById(subMenuId);
        //subMenu.ondrag = App.preventdefault;
        for (var i = 0; i < options.length; i++) {

            var li: HTMLLIElement = document.createElement("li");
            var a: HTMLAnchorElement = document.createElement("a");
            li.appendChild(a);
            a.href = options[i];
            a.draggable = true;
            a.ondragstart = this.selectDrag;
            //option.onmousedown = App.preventdefault;
            
            //option.ondrag = this.selectDrag;
            a.text = this.cleanNameElement(options[i], stringStructureRemoved);
            subMenu.appendChild(li)
        }
    }

    cleanNameElement(elementComplete: string, stringStructureRemoved: string): string {
        return elementComplete.replace(stringStructureRemoved, "").replace(".dsp", "");
    }

    
    selectDrag() {
        //event.preventDefault();
    }


    imageNode: IImageNode;

    initLibrary(parent: HTMLDivElement): void{

        var library: HTMLElement = document.createElement("div");
        library.id = "menuContainer";

        var libraryButton: HTMLElement = document.createElement("div");
        libraryButton.id = "libraryButton";
        libraryButton.className = "menuButton";

        var libraryContent: HTMLElement = document.createElement("div");
        libraryContent.id = "libraryContent";
        libraryContent.className = "menuContent";

        var instrumentLibraryContent: HTMLElement = document.createElement("div");
        instrumentLibraryContent.id = "instrumentLibraryContent";
        instrumentLibraryContent.className = "submenuLibraryContent";

        var instrumentLibraryTitle: HTMLSpanElement = document.createElement("span");
        instrumentLibraryTitle.id = "instrumentLibraryTitle";
        instrumentLibraryTitle.className = "libraryTitles";

        var effetLibraryContent: HTMLElement = document.createElement("div");
        effetLibraryContent.id = "effetLibraryContent";
        effetLibraryContent.className = "submenuLibraryContent";

        var effetLibraryTitle: HTMLSpanElement = document.createElement("span");
        effetLibraryTitle.id = "effetLibraryTitle";
        effetLibraryTitle.className = "libraryTitles";

        var exempleLibraryContent: HTMLElement = document.createElement("div");
        exempleLibraryContent.id = "exempleLibraryContent";
        exempleLibraryContent.className = "submenuLibraryContent";

        var exempleLibraryTitle: HTMLSpanElement = document.createElement("span");
        exempleLibraryTitle.id = "exempleLibraryTitle";
        exempleLibraryTitle.className = "libraryTitles";

        var instrumentLibraryContent: HTMLElement = document.createElement("div");
        instrumentLibraryContent.id = "instrumentLibraryContent";
        instrumentLibraryContent.className = "submenuLibraryContent"; 
    }

    /***************  OPEN/CLOSE LIBRARY DIV  ***************************/
    changeLibraryState(event: MouseEvent, library: Library):void {

        var libDiv: HTMLElement = document.getElementById("library");

        var boudingRect: ClientRect = libDiv.getBoundingClientRect();


        if (event.type == "mouseover" && library.imageNode.state == "closed") {
            library.imageNode.src = App.baseImg + "close.png";
            library.imageNode.state = "opened";

            library.viewLibraryList(library);
	    }
	    else if(event.type == "mouseout" && (event.clientX > boudingRect.right || event.clientX < boudingRect.left || event.clientY < boudingRect.top || event.clientY > boudingRect.bottom)){

            library.imageNode.src = App.baseImg + "open.png";
            library.imageNode.state = "closed";

            library.deleteLibraryList(library);
	    }
    }

    //--- Load Library Content
    viewLibraryList(library: Library):void {

	    document.getElementById("libraryTitle").style.cssText = " writing-mode:lr-tb; -webkit-transform:rotate(0deg); -moz-transform:rotate(0deg); -o-transform: rotate(0deg); display:block; position: relative; top:3%; left:5px; font-family: 'Droid Serif', Georgia, serif;  font-size:20px; z-index:3; margin: 0px 0px 0px 0px; padding: 0px 0px 0px 0px;";
	    document.getElementById("library").style.cssText = "width:250px;";
	    document.getElementById("arrow").style.cssText = "display: block; position: absolute; left:200px; top:2%; z-index:3;";

        var spaceDiv: HTMLDivElement = document.createElement("div");
	    spaceDiv.className = "space";

	    document.getElementById("library").appendChild(spaceDiv);

	    //var url = "http://faust.grame.fr/www/pedagogie/index.json";
	    var url:string = "faust-modules/index.json"

        var getrequest: XMLHttpRequest = new XMLHttpRequest();

	    getrequest.onreadystatechange = function() {
		    console.log("enter onreadystatechange");
		    if(getrequest.readyState == 4 && getrequest.status == 200) {

			    App.libraryContent = getrequest.responseText;

			    var data:JSON = JSON.parse(App.libraryContent);

			    var sections:string[] = ["instruments", "effets", "exemples"];

			    for(var i=0; i<3; i++){
				    var section = sections[i];

                    var div: HTMLUListElement = document.createElement("ul");
                    div.className = "ulElem";
                    document.getElementById("library").appendChild(div);

                    if (App.isTooltipEnabled) {
					    var tooltip = this.toolTipForLibrary(section);
					    div.appendChild(tooltip);
				    }

                    var sel1: HTMLLIElement = document.createElement("li");
				    sel1.id = "generalSection";
				    sel1.className="sections";


				    div.appendChild(document.createElement("br"));


                    library.imageNode= <IImageNode>document.createElement('img');
                    library.imageNode.src= App.baseImg + "triangleOpen.png";
                    library.imageNode.state = "opened";
                    library.imageNode.section = section;
                    library.imageNode.onclick = this.changeSectionState;

                    sel1.appendChild(library.imageNode);
				    sel1.appendChild(document.createTextNode("  "+section));

				    div.appendChild(sel1);
				    div.appendChild(document.createElement("br"));

                    library.viewFolderContent(library);
        	    }
    	    }
	    }
	    getrequest.open("GET", url, true);
	    getrequest.send(null);
    }

    //--- Unload Library Content
    deleteLibraryList(library: Library):void {

        var libraryDiv: HTMLElement = document.getElementById("library");
        var arrow: HTMLElement = document.getElementById("arrow");

	    for(var i=libraryDiv.childNodes.length-1; i>=0; i--){

            if (libraryDiv.childNodes[i] != arrow && libraryDiv.childNodes[i] != document.getElementById("libraryTitle"))
			    libraryDiv.removeChild(libraryDiv.childNodes[i]);
	    }

	    document.getElementById("libraryTitle").style.cssText =  "  -webkit-transform:rotate(270deg); -moz-transform:rotate(270deg); -o-transform: rotate(270deg); display:block; position: relative; top:40%; right:250%; width:300px; font-family: 'Droid Serif', Georgia, serif;  font-size:20px; z-index:3; margin: 0px 0px 0px 0px; padding: 0px 0px 0px 0px;";
	    document.getElementById("library").style.cssText = "width:50px;";
	    document.getElementById("arrow").style.cssText = "display: block; margin-left: auto; margin-right: auto;";
    }

    //-------- CLOSE LIB ON LINK DRAGGING OUT OF LIB
    onLinkDrag(event: MouseEvent, library: Library) {

        if (event.x > document.getElementById("library").getBoundingClientRect().width) {
            ;
            library.imageNode.src = App.baseImg + "open.png";
            library.imageNode.state = "closed";

            library.deleteLibraryList(library);
	    }
    }

    onclickPrevent(event: MouseEvent) {
	    event.preventDefault();
    }


    /***************  OPEN/CLOSE SECTION OF LIBRARY  ***************************/
    changeSectionState(event):void {
	    if(event.target.state == "closed"){
		    event.target.src = App.baseImg + "triangleOpen.png";
		    event.target.state = "opened";

		    this.viewFolderContent(event.target);
	    }
	    else{
		    event.target.src = App.baseImg + "triangleClose.png";
		    event.target.state = "closed";

		    this.deleteFolderContent(event.target);
	    }
    }

    viewFolderContent(library: Library) {

	    var data = JSON.parse(App.libraryContent);

        var selFolder = library.imageNode.section;

        var section = data[selFolder];

        var sublist=document.createElement("ul");
        sublist.className = "subsections";
        library.imageNode.parentNode.appendChild(sublist);

	    for (var subsection in section) {

		    var liElement = document.createElement("li");
		    sublist.appendChild(liElement);

		    var filename = section[subsection].toString().split( '/' ).pop();
		    filename = filename.toString().split('.').shift();

            var link: HTMLAnchorElement = document.createElement("a");
		    link.className="link";
		    // var linkAdd = "http://faust.grame.fr/www/pedagogie/" + selFolder + "/" + filename + ".dsp";
		    var linkAdd = section[subsection];
		    link.setAttribute("href", linkAdd);
		    link.textContent = filename;
            link.onclick = this.onclickPrevent;
            link.ondrag = function (event) { library.onLinkDrag(event, library) };
		    liElement.appendChild(link);
	    }

    }

    deleteFolderContent(selector){

	    var liElement = selector.parentNode;

	    for(var i=0; i<liElement.childNodes.length; i++){

		    if(liElement.childNodes[i].className=="subsections"){
			    liElement.removeChild(liElement.childNodes[i]);
			    break;
		    }
	    }


    }
}
