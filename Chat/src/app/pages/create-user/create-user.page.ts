import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.page.html',
  styleUrls: ['./create-user.page.scss'],
})
export class CreateUserPage implements OnInit {

  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private navCtrl: NavController) { }

  form = this.formBuilder.group({
    "name": ["", Validators.required],
    "password": ["", Validators.required]
  })

  ngOnInit() {
  }

  async createUser() {
    if (this.form.valid) {
      try {
        let res = await this.httpService.postUnauthorized("/create-user", {
          name: this.form.controls.name.value!,
          password: this.form.controls.password.value!
        });
        alert("User created! Redirecting to login page!");
        this.navCtrl.navigateRoot("login");
        return;

      } catch(error: any) {
        alert(error.error.message);
        return;
      }
      
      
    }
  }

}
