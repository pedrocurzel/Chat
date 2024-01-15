import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http/http.service';
import { ThemeBehaviorSubjectService } from 'src/app/services/theming/theme-behavior-subject.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private navCtrl: NavController, private formBuilder: FormBuilder, private httpService: HttpService) { }

  form = this.formBuilder.group({
    name: ["", Validators.required],
    password: ["", Validators.required]
  })

  ngOnInit() {
  }

  async login() {
    if (this.form.valid) {
      try {
        let user = {
          name: this.form.controls.name.value!,
          password: this.form.controls.password.value!
        };
        let res = await this.httpService.postUnauthorized("/login", user);
        localStorage.setItem("user", JSON.stringify({
          name: user.name,
          id: res.userId
        }));
        localStorage.setItem("token", res.token);
        this.navCtrl.navigateRoot("home");
      } catch(error: any) {
        console.log(error);
        alert(error.error.message);
      }
    }
  }

  createUser() {
    this.navCtrl.navigateForward("create-user");
  }

}


interface loginSuccess {
  userId: number,
  token: string,
  message: string
}