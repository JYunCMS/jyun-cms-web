import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppComponent } from '../component/app.component';

@Injectable({
  providedIn: 'root'
})

export class ResponseService {

  constructor() {
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // 将错误信息打印到控制台
      console.log(`The error comes from: ${operation}`);
      console.log(error);

      // 应用界面为用户弹出错误提示
      AppComponent.self.errorMessage = `${error.error.message}`;

      // 通过返回空结果让应用程序继续运行
      return of(result as T);
    };
  }
}
