<template>
  <div class="container">
    <div class="row">
      <div class="offset-sm-1 col-sm-10">
        <div class="btn-panel btn-panel-msg">
          <a v-if="selectedChatRoom" class="btn col-lg-6 text-primary pull-right">{{selectedChatRoom.chatRoomName}} |  {{currentUser.name}}</a>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="conversation-wrap col-lg-3">

        <template v-if="chatRooms.length">
            <div v-for="chatRoom in chatRooms" :key="chatRoom.id" class="media conversation">
              <a @click="changeChatRoom(chatRoom)" class="pull-left" href="#">
                <img
                  class="media-object"
                  data-src="holder.js/64x64"
                  alt="64x64"
                  src="../assets/chatroom.png"
                />
              </a>
              <div class="media-body mt-4">
                <h5 class="media-heading">{{chatRoom.chatRoomName}}</h5>
              </div>
            </div>
        </template>
        <template v-else>
          <p class="text-center mt-2">Not availables messages chat room.</p>
        </template>

          <h5 class="mt-1">Available Bot commands</h5>
          <h6>1. Stock information  <b-badge class="c-pointer" @click="insertComand('/stock=stock_code')">/stock=stock_code</b-badge></h6>

      </div>

      <div class="message-wrap col-lg-8">
        <div id="msg-wrap" class="msg-wrap">
          <template v-if="chatRoomMessages.length">
            <div v-for="message in chatRoomMessages" :key="message.id"  class="media msg">
            <a class="pull-left" href="#">
              <img
                class="media-object msg"
                data-src="holder.js/64x64"
                alt="64x64"
                :src="message.messageFromUser === 'bot' ? `${require('../assets/bot.png')}`:`${require('../assets/user.png')}`"
              />
            </a>
            <div class="media-body">
              <small class="pull-right time">
                <i class="fa fa-clock-o"></i> {{message.messageTime | dateFilter}} 
              </small>

              <h5 class="media-heading ml-1">{{message.messageFromUser}}</h5>
              <p
                class="col-lg-10 text-justify ml-2"
              >{{message.message}}</p>
            </div>
          </div>
          </template>
          <template v-else>
            <p class="text-center">No messages in the current chat room.</p>
          </template>


        </div>

        <div class="send-wrap">
          <textarea @keypress.enter="sendMessage" v-model="message" class="form-control send-message" rows="3" placeholder="Write a message..."></textarea>
        </div>
        <div class="btn-panel">
          <a @click="sendMessage"
            class="col-lg-12 text-center btn btn-info send-message-btn text-dark pull-right"
            role="button"
          >
            Send Message
            <i class="fa fa-send"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as signalR from '@microsoft/signalr';
import ChatRoomModel from '../model/ChatRoomModel'
import ChatRoomMessageModel from '../model/ChatRoomMessageModel'
import {IUser} from '../utils/CustomTypes'
import CONSTANTS from '../utils/Constants';
import { format } from 'date-fns'

@Component({
  filters:{
    dateFilter:function(date ){
        return format(new Date(date),  'yyyy-MM-dd HH:mm')
    }
  }
})
export default class ChatRoom extends Vue {
  public apiUrl = process.env.VUE_APP_API_URL;
  // public connection!: signalR.HubConnectionBuilder;
  connection: signalR.HubConnection;
  public currentUser = this.$store.getters.getUser as IUser;
  public chatRooms:ChatRoomModel[] =[]
  public chatRoomMessages:ChatRoomMessageModel[] =[]
  public selectedChatRoom:ChatRoomModel = null;
  public message = null;
  
    fetchConfig =  {
      headers: {
        'Authorization': 'Bearer '+ this.$store.getters.token
      }
        // 'Content-Type': 'application/x-www-form-urlencoded',
    }
  async mounted() {
    this.chatRooms = await this.getChatRooms();
    this.selectedChatRoom = this.chatRooms[0]
    await this.initSignalR();
    await this.initializeChatRoom()
  }

   public async  getChatRooms():Promise<ChatRoomModel[]>{
    return new Promise((res,rej)=>{
        fetch(this.apiUrl+"api/ChatRoom",this.fetchConfig)
          .then(resp => resp.json())
          .then(json => res(json)).then(()=>{
          
      }).catch(err => rej(err));
    })
  }

  changeChatRoom(chatRoom: ChatRoomModel){
      this.selectedChatRoom = chatRoom;
      this.initializeChatRoom();
  }


  insertComand(command){
    this.message=command
  }


  public async initializeChatRoom(){
      this.enrolUserToChatRoom(this.selectedChatRoom);
      this.chatRoomMessages = await this.getLatestMessages(this.selectedChatRoom);
  }

  public sendMessage(){
    this.connection.invoke(CONSTANTS.SND_MESSAGE,this.selectedChatRoom.chatRoomCode,this.currentUser.name,this.message)
    .then((resp)=>{
      this.message = null;
    })
    .catch(function (err) {
        return console.error(err.toString());
    });
  }


  public initSignalR(){
        let self = this;

    return new Promise((resolv,reject)=>{
      this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.apiUrl + "chatHub")
      .configureLogging(signalR.LogLevel.Trace)
      .withAutomaticReconnect()
      .build();

      this.connection.onclose(error => {
        console.assert(this.connection.state === signalR.HubConnectionState.Disconnected);
        console.log(`Connection closed due to error. Try refreshing this page to restart the connection.`);
    });
        this.connection.on(CONSTANTS.ON_MSG_RECVD, function (message) {
          //tempId
          const messageId = Math.random().toString(36).substring(2) + Date.now().toString(36);
          self.chatRoomMessages.push({
            id: messageId,
            message:message.message,
            messageFromUser:message.sender,
            messageTime: message.messageDate,
            chatRoomId: message.chatRoomId
          });
          self.$nextTick().then(r => {
          var chatWrapper = document.getElementById('msg-wrap');
                chatWrapper.scrollTop = chatWrapper.scrollHeight;
          })

           console.log(message);
        });

        this.connection.on(CONSTANTS.ON_USR_ENRLLMENT_RECVD, function (message) {
          console.log(message);
        });

      this.connection.start().then(function(){
            console.log("Connection established")
            resolv()
        }).catch(function (err) {
          reject(err)
            return console.error(err.toString());
        });
    })

  }

  getLatestMessages(chatRoom:ChatRoomModel):Promise<ChatRoomMessageModel[]>{
    return new Promise((resol, rejec)=>{
      fetch(`${this.apiUrl}api/ChatRoom/${chatRoom.id}/Messages`,this.fetchConfig)
        .then(resp=> resp.json())
        .then(json=> resol(json))
        .catch(err=> rejec(err));
      });
  }

  enrolUserToChatRoom(chatRoom:ChatRoomModel){
    console.log(CONSTANTS.ENRLLMENT_GROUP);
    this.connection.invoke(CONSTANTS.ENRLLMENT_GROUP, chatRoom.chatRoomCode)
    .catch(function (err) {
      debugger
        return console.error(err.toString());
    });
  }
}
</script>
<style scoped>
.conversation-wrap {
  box-shadow: -2px 0 3px #ddd;
  padding: 0;
  max-height: 400px;
  overflow: auto;
}
.conversation {
  padding: 5px;
  border-bottom: 1px solid #ddd;
  margin: 0;
}

.message-wrap {
  box-shadow: 0 0 3px #ddd;
  padding: 0;
}
.msg {
  padding: 5px;
  /*border-bottom:1px solid #ddd;*/
  margin: 0;
}
.msg-wrap {
  padding: 10px;
  max-height: 600px;
  overflow: auto;
}

.time {
  color: #bfbfbf;
}

.send-wrap {
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 10px;
  /*background: #f8f8f8;*/
}

.send-message {
  resize: none;
}

.highlight {
  background-color: #f7f7f9;
  border: 1px solid #e1e1e8;
}

.send-message-btn {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 0;

  border-bottom-right-radius: 0;
}
.btn-panel {
  background: #f7f7f9;
}

.btn-panel .btn {
  color: #b8b8b8;

  transition: 0.2s all ease-in-out;
}

.btn-panel .btn:hover {
  color: #666;
  background: #f8f8f8;
}
.btn-panel .btn:active {
  background: #f8f8f8;
  box-shadow: 0 0 1px #ddd;
}

.btn-panel-conversation .btn,
.btn-panel-msg .btn {
  background: #f8f8f8;
}
.btn-panel-conversation .btn:first-child {
  border-right: 1px solid #ddd;
}

.msg-wrap .media-heading {
  color: #003bb3;
  font-weight: 700;
  text-align: left;
}

.media.conversation img.media-object {
  width: 70px;
  height: 70px;
}

.msg-wrap .media-object.msg {
  width: 70px;
  height: 70px;
}
.msg-date {
  background: none;
  text-align: center;
  color: #aaa;
  border: none;
  box-shadow: none;
  border-bottom: 1px solid #ddd;
}

body::-webkit-scrollbar {
  width: 12px;
}
/* Let's get this party started */
::-webkit-scrollbar {
  width: 6px;
}

/* Track */
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  /*        -webkit-border-radius: 10px;
        border-radius: 10px;*/
}

/* Handle */
::-webkit-scrollbar-thumb {
  /*        -webkit-border-radius: 10px;
        border-radius: 10px;*/
  background: #ddd;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}
::-webkit-scrollbar-thumb:window-inactive {
  background: #ddd;
}

.c-pointer{
  cursor: pointer;
}
</style>
