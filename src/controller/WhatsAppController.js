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

                this.initContacts();
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

    initContacts(){
        

        this._user.on('contactschange',docs=>{
            this.el.contactsMessagesList.innerHTML = '';

            docs.forEach(doc=>{
                let contact = doc.data();
                let div = document.createElement('div');
                div.className = 'contact-item';
                div.innerHTML = `
                    <div class="dIyEr">
                        <div class="_1WliW" style="height: 49px; width: 49px;">
                            <img src="#" class="Qgzj8 gqwaM photo" style="display:none;">
                            <div class="_3ZW2E">
                                <span data-icon="default-user" class="">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="212" height="212">
                                        <path fill="#DFE5E7" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path>
                                        <g fill="#FFF">
                                            <path d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path>
                                        </g>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="_3j7s9">
                        <div class="_2FBdJ">
                            <div class="_25Ooe">
                                <span dir="auto" title="${contact.name}" class="_1wjpf">${contact.name}</span>
                            </div>
                            <div class="_3Bxar">
                                <span class="_3T2VG">${contact.lastMessageTime}</span>
                            </div>
                        </div>
                        <div class="_1AwDx">
                            <div class="_itDl">
                                <span title="digitando…" class="vdXUe _1wjpf typing" style="display:none">digitando…</span>

                                <span class="_2_LEW last-message">
                                    <div class="_1VfKB">
                                        <span data-icon="status-dblcheck" class="">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18">
                                                <path fill="#263238" fill-opacity=".4" d="M17.394 5.035l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-.427-.388a.381.381 0 0 0-.578.038l-.451.576a.497.497 0 0 0 .043.645l1.575 1.51a.38.38 0 0 0 .577-.039l7.483-9.602a.436.436 0 0 0-.076-.609zm-4.892 0l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-2.614-2.556a.435.435 0 0 0-.614.007l-.505.516a.435.435 0 0 0 .007.614l3.887 3.8a.38.38 0 0 0 .577-.039l7.483-9.602a.435.435 0 0 0-.075-.609z"></path>
                                            </svg>
                                        </span>
                                    </div>
                                    <span dir="ltr" class="_1wjpf _3NFp9">${contact.lastMessage}</span>
                                    <div class="_3Bxar">
                                        <span>
                                            <div class="_15G96">
                                                <span class="OUeyt messages-count-new" style="display:none;">1</span>
                                            </div>
                                    </span></div>
                                    </span>
                            </div>
                        </div>
                    </div>
        
                `;

                if(contact.photo){
                    //pega a referencia do elemento na div para trocar os dados
                    let img = div.querySelector('.photo');
                    img.src = contact.photo;
                    img.show();
                }

                div.on('click',e=>{
                    this.el.activeName.innerHTML   = contact.name;
                    this.el.activeStatus.innerHTML = contact.status;

                    if(contact.photo){
                       let img = this.el.activePhoto;
                       img.src = contact.photo;
                       img.show();
                    }

                    this.el.home.hide();
                    this.el.main.css({
                        display:'flex'
                    });
                });

                this.el.contactsMessagesList.appendChild(div);
            });

        });
        this._user.getContact();
    }//initContacts

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

            this.el.btnSavePanelEditProfile.disabled = true;
            this._user.name = this.el.inputNamePanelEditProfile.innerHTML;
            this._user.save().then(()=>{
                this.el.btnSavePanelEditProfile.disabled = false;
            });

        });        

        this.el.formPanelAddContact.on('submit', e=>{
            e.preventDefault();

            //Cria um objeto com os campos existente no fomulario
            let formData = new FormData(this.el.formPanelAddContact);

            let contact = new User(formData.get('email'));

            contact.on('datachange', data=>{
                if(data.name){
                    this._user.addContact(contact).then(()=>{

                        this.el.btnClosePanelAddContact.click();
                        console.info('Contado Inserido!');
                    });
                }else{
                    console.error('Usuario não encontrado!');
                }
            });

            
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