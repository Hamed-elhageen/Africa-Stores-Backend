import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(isOnline:boolean, page: number): string {
    console.log(isOnline);
    console.log(page);
    // if (3<4)
    //   throw new HttpException("Not Implemented", 501);
    return `hello world`;
  }

  PostHello(body: any) {
    // if (3<4) 
    // throw new HttpException("Not Implemented", 501);
    console.log(body);
    console.log("Post method called");
    return {
      message: "Data received successfully",
      data: body
    };
  }
}
