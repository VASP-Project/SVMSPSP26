import { Injectable } from "@angular/core";
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

@Injectable({providedIn: 'root'})
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';
  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        month : parseInt(date[0], 10),
        day : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.month + this.DELIMITER + date.day + this.DELIMITER + date.year : '';
  }
}

@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      // console.log(value)
      const date = value.split(this.DELIMITER);
      return {
        month : parseInt(date[1], 10),
        day : parseInt(date[0], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}



// const pad = (i: number): string => i < 10 ? `0${i}` : `${i}`;
// @Injectable()
// export class NgbTimeStringAdapter extends NgbTimeAdapter<string> {

//   fromModel(value: string| null): NgbTimeStruct | null {
//     if (!value) {
//       return null;
//     }
//     const split = value.split(':');
//     return {
//       hour: parseInt(split[0], 10),
//       minute: parseInt(split[1], 10),
//       second: parseInt(split[2], 10)
//     };
//   }

//   toModel(time: NgbTimeStruct | null): string | null {
//     return time != null ? `${pad(time.hour)}:${pad(time.minute)}:${pad(time.second)}` : null;
// //   }
// }
