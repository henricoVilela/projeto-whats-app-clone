import { User } from '../model/User.js';
import {Format} from './../util/Format.js';
import {Firebase} from './../util/Firebase';
import {CameraController} from './CameraController.js';
import {MicrophoneController} from './MicrophoneController.js';
import {DocumentPreviewController} from './DocumentPreviewController.js';



export class WhatsAppController{
    constructor(){
    
        this._firebase = new Firebase();
        this.initAuth();//autenticação no firebase
        this.elementsPrototype();
        this.loadElements();
        this.initEvents();
        
    }

    initAuth(){
        this._firebase.initAuth().then((response)=>{

            this._user = new User(response.user.email);


            //criando um evento
            this._user.on('datachange', data=>{

                document.querySelector('title').innerHTML = data.name + ' - Whatsapp';
                this.el.inputNamePanelEditProfile.innerHTML = data.name;

                if(data.photo){
                    let photo = this.el.imgPanelEditProfile;
                    photo.src = data.photo;
                    photo.show();
                    this.el.imgDefaultPanelEditProfile.hide();
                    
                    let photo2 = this.el.myPhoto.querySelector('img');
                    photo2.src = data.photo;
                    photo2.show();
                }

            });

            this._user.name  = response.user.displayName;
            this._user.email = response.user.email;
            this._user.photo = response.user.photoURL;

            this._user.save().then(()=>{
                this.el.appContent.css({
                    display: 'flex'
                });
            });

        }).catch(err=>{
            console.log(err);
        });
    }//initAuth

    //metodo que vai carregar todos os elementos que tenha ID da tela e transforma em objetos manipulaveis
    //quando sao poucos elementos pra adicionar eventos tudo bem fazer na mao, mas quando é uma tela grande 
    //fica inviavel fazer um querySelector para cada elemento que quer manipular.
    loadElements(){
        /*ja que todos os id dessa tela segue um padrão (#nome1-nome2-...), a ideia é transformar em 
          objetos com a nomeclatura CamelCase: (nome1Nome2Nome3...).
          Entao um elemento que tem o Id="nav-bar-img" podera ser acessado no nosso codigo: el.navBarImg;
        */
        this.el = {};
        
        document.querySelectorAll('[id]').forEach(element=>{
            this.el[Format.getCamelCase(element.id)] = element;
        });

    }//loadElements

    //adicionando uma funcao minha no prototype da class Element (Nativa), usando function() para fechar o scopo
    elementsPrototype(){
        
        //esconder element 
        Element.prototype.hide = function (){
            this.style.display = 'none'
            return this;//serve para alinha as chamadas: Element.prototype.hide().addClass()....
        }

        //apresentar element
        Element.prototype.show = function (){
            this.style.display = 'block'
            return this;
        }

        //alternar a propriedade display
        Element.prototype.toggle = function (){
            this.style.display = ( this.style.display === 'none') ? 'block' : 'none' ;
            return this;
        }

        //adicionar multiplos eventos
        Element.prototype.on = function (events, fn){
            events.split(' ').forEach(event=>{
                this.addEventListener(event, fn);
            });
            return this;
        }

        //adicionar css ao element
        Element.prototype.css = function(styles){
            for (let name in styles ){
                this.style[name] = styles[name];
            }
            return this;
        }

        //adicionar classe ao element
        Element.prototype.addClass = function(name) {
            this.classList.add(name);
            return this;
        }

        //remover classe ao element
        Element.prototype.removeClass = function(name) {
            this.classList.remove(name);
            return this;
        }

        //alternar classe ao element
        Element.prototype.toggleClass = function(name) {
            this.classList.toggle(name);
            return this;
        }

        //verificar se existe uma classe
        Element.prototype.hasClass = function(name) {
            return this.classList.contains(name);
        }

        //retornar o formData de qualquer formulario presente na pagina
        HTMLFormElement.prototype.getForm = function() {
            return new FormData(this);
        }

        //retornar os dados de qualquer formulario presente na pagina no formato Json
        HTMLFormElement.prototype.toJSON = function() {
            let json = {};
            this.getForm().forEach((value,key)=>{
                json[key] = value;
            });

            return json;
        }

    }//elementsPrototype

    initEvents(){
        //usando os metodos criado em Element.prototype
        
        //event para mostrar panel de mudar o perfil
        this.el.myPhoto.on('click', e=>{
            this.closeAllLeftPane();
            this.el.panelEditProfile.show();
            //Isso é feito para da tempo de adicionar a class css que faz a transição quando o elemento html ja estiver na tela
            setTimeout(() => {
                this.el.panelEditProfile.addClass('open');
            }, 100);

        });

        //event para fechar panel de mudar o perfil
        this.el.btnClosePanelEditProfile.on('click', e=>{
            this.el.panelEditProfile.removeClass('open');
        });

        //event para mostrar o panel de adiconar um contato
        this.el.btnNewContact.on('click', e=>{
            this.closeAllLeftPane();
            this.el.panelAddContact.show();
            
            //Isso é feito para da tempo de adicionar a class css que faz a transição quando o elemento html ja estiver na tela
            setTimeout(() => {
                this.el.panelAddContact.addClass('open');
            }, 100);
            
        });

        //event para fechar o panel de adiconar um contato
        this.el.btnClosePanelAddContact.on('click', e=>{
            this.el.panelAddContact.removeClass('open');
        });

        //event para escolher a foto do perfil
        this.el.photoContainerEditProfile.on('click', e=>{
            this.el.inputProfilePhoto.click();
        });

        //event para tratar a entrada do nome de usuario (press ENTER)
        this.el.inputNamePanelEditProfile.on('keypress',e=>{
            if(e.key === 'Enter'){
                e.preventDefault();//remover o comportamento padrao
                this.el.btnSavePanelEditProfile.click();
            }
        });

        //event button check para salvar o nome
        this.el.btnSavePanelEditProfile.on('click', e=>{
            console.log(this.el.inputNamePanelEditProfile.innerHTML);
        });        

        this.el.formPanelAddContact.on('submit', e=>{
            e.preventDefault();

            //Cria um objeto com os campos existente no fomulario
            let formData = new FormData(this.el.formPanelAddContact);
        });

        //event de click para a lisa de contatos
        this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(item=>{
            item.on('click', e=>{
                this.el.home.hide();
                this.el.main.css({
                    display: 'flex'
                });
            });
        });

        //event para o click do anexar da tela
        this.el.btnAttach.on('click', e=>{
            this.el.menuAttach.addClass('open');
            //Para a propagação, nao passa para os nós filhos.
            e.stopPropagation();

            //Tem que dar um nome a funcao usada no evento para poder remove-lo posteriomente, 
            //ja que todo click na tela vai dispara um evento e isso nao é perfomatico
            document.addEventListener('click', this.closeMenuAttach.bind(this));//bind(this) passa o scope para a function
        });

        //event para o click do anexar - btnAttachPhoto
        this.el.btnAttachPhoto.on('click', e=>{ 
            this.el.inputPhoto.click();
        });

        this.el.inputPhoto.on('change', e=>{
            console.log(this.el.inputPhoto.files);

            [...this.el.inputPhoto.files].forEach(file => {
                console.log(file);
            });
        });

        //event para o click do anexar - btnAttachCamera
        this.el.btnAttachCamera.on('click', e=>{
            this.closeAllMainPanel();
            this.el.panelCamera.addClass('open');
            this.el.panelCamera.css({
                height: '100%'
            });

            this._camera = new CameraController(this.el.videoCamera);
        });

        //event para fechar o panel da camera
        this.el.btnClosePanelCamera.on('click',e=>{

            this.closeAllMainPanel();
            this.el.panelMessagesContainer.show();
            this._camera.stop();
            
        });

        //event para captura a foto
        this.el.btnTakePicture.on('click', e=>{
            let dataUrl = this._camera.takePicture();

            this.el.pictureCamera.src = dataUrl;
            this.el.pictureCamera.show();
            this.el.videoCamera.hide();
            this.el.btnReshootPanelCamera.show();//btn tirar outra foto
            this.el.containerTakePicture.hide();
            this.el.containerSendPicture.show();
        });

        //event para captura outra foto
        this.el.btnReshootPanelCamera.on('click', e=>{
            this.el.pictureCamera.hide();
            this.el.videoCamera.show();
            this.el.btnReshootPanelCamera.hide();//btn tirar outra foto
            this.el.containerTakePicture.show();
            this.el.containerSendPicture.hide();
        });

        //event para enviar a foto
        this.el.btnSendPicture.on('click', e=>{
            console.log( this.el.pictureCamera.src);
        });

        //event para o click do anexar - btnAttachDocument
        this.el.btnAttachDocument.on('click', e=>{
            this.closeAllMainPanel();
            this.el.panelDocumentPreview.addClass('open');
            this.el.panelDocumentPreview.css({
                height: '100%'
            });

            this.el.inputDocument.click();
        });

        //event change do input file
        this.el.inputDocument.on('change',e=>{
            if (this.el.inputDocument.files.length) {

                let file = this.el.inputDocument.files[0];
                this._documentPreviewController = new DocumentPreviewController(file);

                this._documentPreviewController.getPreviewData().then(result=>{
                    
                    
                    this.el.imgPanelDocumentPreview.src = result.src;
                    this.el.infoPanelDocumentPreview.innerHTML = result.info;
                    this.el.imagePanelDocumentPreview.show();
                    this.el.filePanelDocumentPreview.hide();
                }).catch(err=>{
                    
                    switch (file.type) {
                        case 'application/vnd.ms-excel':
                        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-xls';
                        break;

                        case 'application/vnd.ms-powerpoint':
                        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-ppt';
                        break;

                        case 'application/vnd.ms-msword':
                        case 'application/msword':
                        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-doc';
                        break;
                        
                        default:
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-generic';
                            break;
                    }
                    this.el.filenamePanelDocumentPreview.innerHTML = file.name;
                    this.el.imagePanelDocumentPreview.hide();
                    this.el.filePanelDocumentPreview.show();
                });
            }
        });

        //event para o click do anexar - btnAttachContact
        this.el.btnAttachContact.on('click', e=>{
            this.el.modalContacts.show();
        });

        //event para fechar o modal dos contatos
        this.el.btnCloseModalContacts.on('click',e=>{
            this.el.modalContacts.hide();
        });

        //event para fechar o panel do document
        this.el.btnClosePanelDocumentPreview.on('click',e=>{
            this.closeAllMainPanel();
            this.el.panelMessagesContainer.show();
        });

        //event para enviar o documento
        this.el.btnSendDocument.on('click', e=>{
            console.log('send document');
        });

        //event para enviar audio
        this.el.btnSendMicrophone.on('click', e=>{  
            this.el.btnSendMicrophone.hide();
            this.el.recordMicrophone.show();
            this._microphoneController = new MicrophoneController();

            this._microphoneController.on('ready', audio=>{

                console.log('ready event');
                this._microphoneController.startRecord();
                
            });

            this._microphoneController.on('recordtimer', timer => {
                this.el.recordMicrophoneTimer.innerHTML = Format.toTime(timer);
            });
        });

        //event para cancelar a gravação 
        this.el.btnCancelMicrophone.on('click', e=>{
            this._microphoneController.stopRecord();
            this.closeRecordMicrophone();
        });

        //event para finalizar a gravação
        this.el.btnFinishMicrophone.on('click', e=>{
            this._microphoneController.stopRecord();
            this.closeRecordMicrophone();
        });

        //event ao digitar a msg de texto
        this.el.inputText.on('keyup', e=>{

            if (this.el.inputText.innerHTML.length){
                this.el.inputPlaceholder.hide();
                this.el.btnSendMicrophone.hide();
                this.el.btnSend.show();
                if(this.el.inputText.innerHTML == '<br>') this.el.inputText.innerHTML = '';
            }else{
                this.el.inputPlaceholder.show();
                this.el.btnSendMicrophone.show();
                this.el.btnSend.hide();
            }
        });

        //event para o Enter (send) quando esta escrevendo a msg.
        this.el.inputText.on('keypress', e=>{
            if(e.key === 'Enter' && !e.ctrlKey){
                e.preventDefault();
                this.el.btnSend.click();
            }
        });

        //event para enviar msg
        this.el.btnSend.on('click', e=>{
            console.log(this.el.inputText.innerHTML);
        });

        //event para abrir o painel com os emojis
        this.el.btnEmojis.on('click', e=>{
            this.el.panelEmojis.toggleClass('open');
        });

        //event para selecionar um emoji
        this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji=>{
            emoji.on('click', e=>{
                //faz uma copia do emoji para colocar na msg
                let img = this.el.imgEmojiDefault.cloneNode();
                img.style.cssText   = emoji.style.cssText;
                img.dataset.unicode = emoji.dataset.unicode;
                img.alt = emoji.dataset.unicode;

                emoji.classList.forEach(name=>{
                    img.classList.add(name);
                });

                //pega onde esta o cursor do teclado
                let cursor = window.getSelection();
                if((!cursor.focusNode) || (!cursor.focusNode.id == 'input-text')){
                    this.el.inputText.focus();
                    cursor = window.getSelection();
                }

                //cria um range para deletar a parte selecionada na msg
                let range = document.createRange();
                range = cursor.getRangeAt(0);
                range.deleteContents();

                //cria um fragmento para adicionar a img onde foi 'excluido' o range de caracter da msg
                let frag = document.createDocumentFragment();
                frag.appendChild(img);
                range.insertNode(frag);
                range.setStartAfter(img);//joga o cursor para depois do emoji que adicionou

                this.el.inputText.dispatchEvent(new Event('keyup'));
            });
        });


        

    }//initEvents


    closeRecordMicrophone(){
        this.el.recordMicrophone.hide();
        this.el.btnSendMicrophone.show();
    }//closeRecordMicrophone

    closeAllLeftPane(){
        this.el.panelEditProfile.hide();
        this.el.panelAddContact.hide();
    }//closeAllLeftPane

    closeMenuAttach(e){

        document.removeEventListener('click',this.closeMenuAttach);
        this.el.menuAttach.removeClass('open');

    }//closeMenuAttach

    closeAllMainPanel(){
        this.el.panelMessagesContainer.hide();
        this.el.panelDocumentPreview.removeClass('open');
        this.el.panelCamera.removeClass('open');
    }//closeMenuAttach
}