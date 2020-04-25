<template>
  <div class="container">
    <div class="row">
      <div class="offset-sm-1 col-sm-10">
        <div class="btn-panel btn-panel-msg">
          <a class="btn col-lg-6 text-primary pull-right">Chat Room 1 |  logged as User 1</a>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="conversation-wrap col-lg-3">

        <div v-for="chatRoom in chatRooms" :key="chatRoom.id" class="media conversation">
          <a class="pull-left" href="#">
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

      </div>

      <div class="message-wrap col-lg-8">
        <div class="msg-wrap">
          <div class="media msg">
            <a class="pull-left" href="#">
              <img
                class="media-object msg"
                data-src="holder.js/64x64"
                alt="64x64"
                src="../assets/user.png"
              />
            </a>
            <div class="media-body">
              <small class="pull-right time">
                <i class="fa fa-clock-o"></i> 12:10am
              </small>

              <h5 class="media-heading ml-1">User 1</h5>
              <p
                class="col-lg-10 text-justify ml-2"
              >Arnab Goswami: "Some people close to Congress Party and close to the government had a #secret #meeting in a farmhouse in Maharashtra in which Anna Hazare send some representatives and they had a meeting in the discussed how to go about this all fast and how eventually this will end."</p>
            </div>
          </div>

          <div class="media msg">
            <a class="pull-left" href="#">
              <img
                class="media-object msg"
                data-src="holder.js/64x64"
                alt="64x64"
                src="../assets/bot.png"
              />
            </a>
            <div class="media-body">
              <small class="pull-right time">
                <i class="fa fa-clock-o"></i> 12:10am
              </small>

              <h5 class="media-heading ml-1">Bot</h5>
              <p
                class="col-lg-10 text-justify ml-2"
              >Arnab Goswami: "Some people close to Congress Party and close to the government had a #secret #meeting in a farmhouse in Maharashtra in which Anna Hazare send some representatives and they had a meeting in the discussed how to go about this all fast and how eventually this will end."</p>
            </div>
          </div>
        </div>

        <div class="send-wrap">
          <textarea class="form-control send-message" rows="3" placeholder="Write a reply..."></textarea>
        </div>
        <div class="btn-panel">
          <a @click="enrolUserToChatRoom"
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
@Component({})
export default class ChatRoom extends Vue {
  public apiUrl = process.env.VUE_APP_API_URL;
  // public connection!: signalR.HubConnectionBuilder;
  connection: signalR.HubConnection;
  public currentUser = this.$store.getters.getUser;
  public chatRooms:ChatRoomModel[] =[]

  async mounted() {
    await this.loadChatRooms();
    console.log(this.chatRooms);
    this.initSignalR();

  }

   public async  loadChatRooms(){
    return new Promise((res,rej)=>{
        fetch(this.apiUrl+"api/ChatRoom")
          .then(resp => resp.json())
          .then(json => this.chatRooms = json).then(()=>{
          res()
      }).catch(err => rej(err));
    })


  }


  public initializeChatRoom(chatRoom:ChatRoomModel){

  }


  public initSignalR(){
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl(this.apiUrl + "chatHub")
    .build();

      this.connection.on("ReceiveMessage", function (user, message) {
        console.log(message,user);
      });

      this.connection.start().then(function(){
          console.log("Connection established")
        }).catch(function (err) {
            return console.error(err.toString());
        });
  }

  enrolUserToChatRoom(chatRoom:ChatRoomModel){
    this.connection.invoke("SendMessage", "user", "message").catch(function (err) {
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
  max-height: 400px;
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
</style>
