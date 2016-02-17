﻿
/*				MODULEVIEW.JS
	HAND-MADE JAVASCRIPT CLASS CONTAINING A FAUST MODULE  INTERFACE
	
	Interface structure
	===================
	DIV --> this.fModuleContainer
    H6 --> fTitle
    DIV --> fInterfaceContainer
    DIV --> fCloseButton
    DIV --> fFooter
    IMG --> fEditImg
	===================*/

interface HTMLfEdit extends HTMLImageElement {
    area: HTMLTextAreaElement;
}
interface HTMLinterfaceElement extends HTMLElement {
    label: string;
}
interface HTMLInterfaceContainer extends HTMLDivElement {
    unlitClassname: string;
    lastLit: any;
}

class ModuleView {
    fModuleContainer: HTMLElement;
    fName: string;
    fInterfaceContainer: HTMLInterfaceContainer;
    fEditImg: HTMLfEdit;
    fTitle: HTMLElement;
    fInputNode: HTMLDivElement;
    fOutputNode: HTMLDivElement;
    x: number;
    y: number;


    createModuleView(ID: number, x: number, y: number, name: string, htmlParent: HTMLElement, module: ModuleClass): void {
        var self: ModuleView = this

        // ---- Capturing module instance	
        // ----- Delete Callback was added to make sure 
        // ----- the module is well deleted from the scene containing it

        //------- GRAPHICAL ELEMENTS OF MODULE
        var fModuleContainer = document.createElement("div");
        fModuleContainer.className = "moduleFaust";
        fModuleContainer.style.left = "" + x + "px";
        fModuleContainer.style.top = "" + y + "px";

        var fTitle = document.createElement("h6");
        fTitle.className = "module-title";
        fTitle.textContent = "";
        fModuleContainer.appendChild(fTitle);

        var fInterfaceContainer = <HTMLInterfaceContainer>document.createElement("div");
        fInterfaceContainer.className = "content";
        fModuleContainer.appendChild(fInterfaceContainer);
        //var eventHandler = function (event) { self.dragCallback(event, self) }
        fModuleContainer.addEventListener("mousedown", module.eventDraggingHandler, true);

        if (name == "input") {
            fModuleContainer.id = "moduleInput";
        } else if (name == "output") {
            fModuleContainer.id = "moduleOutput";
        } else {
            var fFooter: HTMLElement = document.createElement("footer");
            fFooter.id = "moduleFooter";
            fModuleContainer.id = "module" + ID;
            var fCloseButton: HTMLAnchorElement = document.createElement("a");
            fCloseButton.href = "#";
            fCloseButton.className = "close";
            fCloseButton.onclick = function () { module.deleteModule(); };
            fModuleContainer.appendChild(fCloseButton);
            var fEditImg = <HTMLfEdit>document.createElement("img");
            fEditImg.src = App.baseImg + "edit.png";

            fEditImg.onclick = function () { module.edit(module); };
            fFooter.appendChild(fEditImg);
            fModuleContainer.appendChild(fFooter);

        }
        
        fModuleContainer.ondrop = function (e) {
            module.sceneParent.parent.uploadOn(module.sceneParent.parent, module, 0, 0, e);
            return true;
        };
        // add the node into the soundfield
        htmlParent.appendChild(fModuleContainer);
        
        //---- Redirect drop to main.js

        this.fName = name;
        this.fModuleContainer = fModuleContainer;
        this.fInterfaceContainer = fInterfaceContainer;
        this.fEditImg = fEditImg;
        this.fTitle = fTitle;
        this.x = x;
        this.y = y;
    }
    // ------ Returns Graphical input and output Node
    getOutputNode(): HTMLElement { return this.fOutputNode; }
    getInputNode(): HTMLElement { return this.fInputNode; }

    getModuleContainer(): HTMLElement {
        return this.fModuleContainer;
    }
    getInterfaceContainer(): HTMLInterfaceContainer {
        return this.fInterfaceContainer;
    }

    setInputNode(): void {
        this.fInputNode = document.createElement("div");
        this.fInputNode.className = "node node-input";
        this.fInputNode.innerHTML = "<span class='node-button'>&nbsp;</span>";
        this.fModuleContainer.appendChild(this.fInputNode);
    }
    setOutputNode():void{
        this.fOutputNode = document.createElement("div");
        this.fOutputNode.className = "node node-output";
        this.fOutputNode.innerHTML = "<span class='node-button'>&nbsp;</span>";
        this.fModuleContainer.appendChild(this.fOutputNode);
    }
    deleteInputOutputNodes(): void {
        if (this.fInputNode)
            this.fModuleContainer.removeChild(this.fInputNode);

        if (this.fOutputNode)
            this.fModuleContainer.removeChild(this.fOutputNode);
    }



    isPointInOutput(x: number, y: number): boolean {

        if (this.fOutputNode && this.fOutputNode.getBoundingClientRect().left < x && x < this.fOutputNode.getBoundingClientRect().right && this.fOutputNode.getBoundingClientRect().top < y && y < this.fOutputNode.getBoundingClientRect().bottom) {
            return true;
        }
        return false;
    }
    isPointInInput(x: number, y: number): boolean {

        if (this.fInputNode && this.fInputNode.getBoundingClientRect().left <= x && x <= this.fInputNode.getBoundingClientRect().right && this.fInputNode.getBoundingClientRect().top <= y && y <= this.fInputNode.getBoundingClientRect().bottom) {
            return true;
        }
        return false;
    }

    isPointInNode(x: number, y: number): boolean {

        if (this.fModuleContainer && this.fModuleContainer.getBoundingClientRect().left < x && x < this.fModuleContainer.getBoundingClientRect().right && this.fModuleContainer.getBoundingClientRect().top < y && y < this.fModuleContainer.getBoundingClientRect().bottom) {
            return true;
        }
        return false;
    }
}