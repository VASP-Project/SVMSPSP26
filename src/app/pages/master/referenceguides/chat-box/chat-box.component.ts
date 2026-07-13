import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReferenceguidesService } from '../referenceguides.service';
@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements AfterViewChecked {
  @ViewChild('chatBox') private chatBox!: ElementRef;
  userInput = '';
  messages: { text: string; sender: 'user' | 'bot' }[] = [];

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
  constructor(private location: Location ,private http: HttpClient, private referenceGuidesServices: ReferenceguidesService) {}

 sendMessage() {
  const userMsg = this.userInput.trim();
  if (!userMsg) return;

  this.messages.push({ sender: 'user', text: userMsg });

  this.referenceGuidesServices.sendmsg(userMsg).subscribe(
  
  
  response => {
      this.messages.push({ sender: 'bot', text: response.reply });
    },
    error => {
      this.messages.push({ sender: 'bot', text: 'Something went wrong.' });
    }
  );

  this.userInput = '';
}


  private scrollToBottom() {
    try {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    } catch (err) {}
  }
  goBack() {
    this.location.back();
  }
}
