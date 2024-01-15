import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  constructor(private httpService: HttpService, private formB: FormBuilder, private socket: Socket, private navCtrl: NavController) {}

  ready = false;
  chat!: Chat;
  messages: Message[] = [];
  userSelected = JSON.parse(localStorage.getItem("user-selected")!) as User;
  loggedUser = JSON.parse(localStorage.getItem("user")!) as User;

  textMessage = this.formB.group({
    message: ["", Validators.required]
  })

  async ngOnInit() {
    this.ready= false;
    this.socket.on("enviar_mensagem", (value:any) => {
      console.log(value);
      this.messages.push(value);
      this.messages.forEach(msg => {
        msg.createdAt = new Date(msg.createdAt);
        msg.updatedAt = new Date(msg.updatedAt);
      })
      this.scrollToLastMessage();
      
    })
    await this.getChat();
    this.ready = true;
  }

  goBack() {
    localStorage.removeItem("user-selected");
    return this.navCtrl.navigateBack("home");
  }

  async sendMessage() {
    if (this.textMessage.valid) {
      try {
        let newMessage = {
          message: this.textMessage.controls.message.value!,
          chatId: this.chat.id,
          senderUserId: this.loggedUser.id
        };
        let messageWithDate = await this.httpService.post("/send-message", newMessage) as any;
        console.log(messageWithDate);
        this.socket.emit("mensagem_enviada", {
          userReceiver: this.userSelected,
          userSender: this.loggedUser,
          mensagem: messageWithDate.messageCreated
        });
        this.messages.push(messageWithDate.messageCreated);
        this.messages.forEach(msg => {
          msg.createdAt = new Date(msg.createdAt);
          msg.updatedAt = new Date(msg.updatedAt);
        })
        this.scrollToLastMessage();
      } catch(error) {
        console.log(error);
        alert("Erro ao enviar mensagem");
      } finally {
        this.textMessage.patchValue({message: ""});
      }

    }
  }

  scrollToLastMessage() {
    setTimeout(() => {
      var lastMsg = this.messages[this.messages.length - 1];
      var msgElement = document.getElementById(`${lastMsg.id}`);
      msgElement?.scrollIntoView({behavior: "smooth"});
    }, 20);
  }

  dateOfMessage(date: Date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  }

  handleUsers() {
    let users = [];

    users.push(this.userSelected, this.loggedUser);
    users.sort((a, b) => {
      if (a.id > b.id) return 1;
      if (b.id > a.id) return -1;
      return 0;
    })
    console.log(users);
    
    return users;
  }

  async getChat() {
    let users = this.handleUsers();
    try {
      var chat = await this.httpService.post(`/create-chat`, {
        userId1: users[0].id,
        userId2: users[1].id
      }) as any;
      this.chat = chat.chats as Chat;
      console.log(this.chat);
      var msgs = await this.getMessages(this.chat.id);
      this.messages = msgs.messages;
      this.messages.forEach(msg => {
        msg.createdAt = new Date(msg.createdAt);
        msg.updatedAt = new Date(msg.updatedAt);
      })
      this.scrollToLastMessage();
    } catch(error) {
      console.log(error);
    }
  }

  async getMessages(chatId: number) {
    return await this.httpService.get(`/get-messages/${chatId}`);
  }

}

interface User {id: number, name:string};

interface Chat {
  id: number,
  user1: number,
  user2: number,
  createdAt: string,
  updatedAt: string
};

interface Message {
  id: number,
  chatId: number,
  senderUserId: number,
  message: string,
  createdAt: Date
  updatedAt: Date
}