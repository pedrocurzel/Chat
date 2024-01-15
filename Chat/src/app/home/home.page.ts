import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpService } from '../services/http/http.service';
import User from '../models/User';
import { ThemeBehaviorSubjectService } from '../services/theming/theme-behavior-subject.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private socket: Socket, private httpService: HttpService, private navCtrl: NavController, private toastCtrl: ToastController) {}

  ready = false;
  users: User[] = [];
  loggedUser = JSON.parse(localStorage.getItem("user")!) as {
    id: number,
    name: string
  };

  async ngOnInit() {
    this.ready = false;
    this.socket.emit("usuario_conectado", this.loggedUser.id);
    this.socket.on("enviar_alerta", async (values: any) => {
      let top = await this.toastCtrl.getTop();
      if (top) {await top.dismiss()}
      let selectedUser = localStorage.getItem("user-selected");
      if (selectedUser == null || JSON.parse(selectedUser).id != values.senderId) {
        let toast = await this.toastCtrl.create({
          duration: 1000,
          message: values.message
        });
        toast.present();
      }
    })
    this.users = [];
    await this.getUsers();
    this.ready = true;
  }

  async getUsers() {
    let user = JSON.parse(localStorage.getItem("user")!);
    let res: Users = await this.httpService.get(`/get-all-users/${user.id}`);
    res.users.forEach(userObj => {
      this.users.push(new User(userObj));
    });
    
  }

  async startChat(user: User) {
    localStorage.setItem("user-selected", JSON.stringify(user));
    return this.navCtrl.navigateForward("chat");
  }

  async logout() {
    localStorage.clear();
    return await this.navCtrl.navigateRoot("login");
  }
}


interface Users {
  message:string,
  users: [
    {
      id: number,
      name: string
    }
  ]
}