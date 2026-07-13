import { Component, OnInit } from "@angular/core";
import { start } from "repl";
import { Badgeholder } from "../badgeholder";
import { Company } from "@app/pages/master/company";
import { ActivatedRoute, Router } from "@angular/router";
import { NovService } from "../nov.service";
import {
  NgbCalendar,
  NgbDateAdapter,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { Toast, ToastrService } from "ngx-toastr";
import { CitationDetails } from "../CitationDetails";
import { ViolationTypes } from "@app/pages/master/violationtypes";
import { ViolationTypesService } from "@app/pages/master/violationtypes/violationtype.service";
import { CitationReasonsService } from "@app/pages/master/CitationReasons/citationreasons.service";
import { CitationReasons } from "@app/pages/master/citationreasons";

@Component({
  selector: "app-citationchatbot",
  templateUrl: "./citationchatbot.component.html",
  styleUrls: ["./citationchatbot.component.scss"],
})
export class CitationchatbotComponent implements OnInit {
  messages: { sender: string; text: string }[] = [];
  userInput = "";
  step: number = 0;
  novData: any = {};
  readonlyBadge: boolean = false;
  ascxuser: boolean = false;
  badgeholder: Badgeholder = new Badgeholder();
  citation: CitationDetails = new CitationDetails();
  allCompanyList: Company[];
  isCompany: boolean = false;
  allViolationTypes: ViolationTypes[] = [];
  allCitationReasonsList: CitationReasons[] = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private NovService: NovService,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private toastr: ToastrService,
    private ViolationTypesService: ViolationTypesService,
    private CitationReasonsService: CitationReasonsService
  ) {}

  ngOnInit(): void {
    console.log("Chatbot initialized");
    this.GetViolationTypeList();
    this.startConversation();
  }

  startConversation() {
    this.botSay("Shall we start NOV?");
    this.step = 1;
  }

  botSay(text: string) {
    this.messages.push({ sender: "Bot", text });
  }

  // sendMessage() {
  //   if (!this.userInput.trim()) return;

  //   const userMsg = this.userInput.trim();
  //   this.messages.push({ sender: "You", text: userMsg });

  //   this.processUserReply(userMsg.toLowerCase());
  //   this.userInput = "";
  // }

  sendMessage() {
  if (!this.userInput.trim()) return;

  const userMsg = this.userInput;
  this.messages.push({ sender: "You", text: userMsg });

  this.userInput = "";

  // 🔥 Call your API
  this.sendToBot(userMsg);
}

sendToBot(text: string) {
  this.NovService.sendToBot(text).subscribe({
    next: (res: any) => {
      // Detect validation error
      if (res?.error && res?.details) {
        const formatted = 
          `⚠️ **Validation Error**\n` +
          res.details.map((d: string) => `• ${d}`).join("\n");

        this.messages.push({ sender: "Bot", text: formatted });
        return;
      }

      // Pretty-print JSON result
      const formatted = this.formatResponse(res);

      this.messages.push({ sender: "Bot", text: formatted });
    },
    error: (err) => {
      this.messages.push({
        sender: "Bot",
        text: "😵 Something scrambled in my circuits. Try again!"
      });
    }
  });
}

formatResponse(res: any): string {
  if (!res) return "I received an empty response.";

  let txt = "";

  // 1) If NOV fields are present
  if (res?.gemini) {
    txt += `📝 **Extracted NOV Details**\n`;
    txt += `• Badge No: ${res.gemini.badgeNumber || "—"}\n`;
    txt += `• Violation Type: ${res.gemini.violationType || "—"}\n`;
    txt += `• Reason: ${res.gemini.citationReason || "—"}\n`;
    txt += `• Location: ${res.gemini.location || "—"}\n`;
    txt += `• Date: ${res.gemini.date || "—"}\n\n`;
  }

  // 2) Badge Info
  if (res?.badgeInfo) {
    txt += `🧾 **Officer Details**\n`;
    for (let k in res.badgeInfo) {
      txt += `• ${k}: ${res.badgeInfo[k]}\n`;
    }
    txt += "\n";
  }

  // 3) Citation mapping (for debugging or summary)
  if (res?.citationDetails) {
    txt += `🔗 **Citation Created**\n`;
    for (let k in res.citationDetails) {
      txt += `• ${k}: ${res.citationDetails[k]}\n`;
    }
  }

  return txt.trim();
}


  public GetViolationTypeList() {
    this.ViolationTypesService.GetViolationTypeList().subscribe(
      (response: ViolationTypes[]) => {
        this.allViolationTypes = response.filter(x => x.status === true);
      },
      (error: any) => {
        console.log("error list");
      }
    );
  }

  public GetCitationReasonListByViolation(violationTypeId: number) {
    this.CitationReasonsService.GetCitationReasonListByViolation(
      violationTypeId
    ).subscribe(
      (response: CitationReasons[]) => {
        this.allCitationReasonsList = response;

         if (!response || response.length === 0) {
        this.botSay("No citation reasons found. Please enter reason manually:");
        this.step = 4;
        return;
      }

      // 🔥 This MUST run immediately after reply "Selected: XYZ"
      this.botSay("Choose a Citation Reason:");
      response.forEach((r, i) => {
        this.botSay(`${i + 1}. ${r.reason}`);
      });

      this.step = 6; // Now ready for user to choose
    

      },
      (error: any) => {
        console.log("error list");
      }
    );
  }

  // ⭐ Main Conversation Logic
  processUserReply(reply: string) {
  switch (this.step) {
    // ------------------------- STEP 1: Start ------------------------------
    case 1:
      if (reply.toLowerCase() === "yes" || reply.toLowerCase() === "y") {
        this.botSay("Great! Please enter badge number:");
        this.step = 2;
      } else {
        this.botSay("Okay! Say 'yes' whenever you want to start.");
      }
      break;

    // ------------------------- STEP 2: Badge ------------------------------
    case 2:
      this.novData.badgeNumber = reply;
      this.botSay("Checking badge in system...");

      this.NovService.GetBadgeByNumber(reply).subscribe(
        (res: any) => {
          if (res?.data?.length > 0) {
            const d = res.data[0];

            this.novData.firstName = d.firstName;
            this.novData.lastName = d.lastName;
            this.novData.company = d.company;

            this.botSay(`Badge found!`);
            this.botSay(`Name: ${d.firstName} ${d.lastName}`);
            this.botSay(`Company: ${d.company}`);
             this.botSay("Choose a Violation Type:");
        this.allViolationTypes.forEach((v, i) =>
          this.botSay(`${i + 1}. ${v.violationType}`)
        );

        this.step = 5;   // Move directly to violation type step
        return;
          } else {
            this.botSay("Badge not found. Please enter First Name:");
            this.step = 3;
            return;
          }

         
        },
        () => {
          this.botSay("Error checking badge. Enter First Name:");
          this.step = 3;
        }
      );
      break;

    // ------------------------ STEP 3: First Name --------------------------
    case 3:
      this.novData.firstName = reply;
      this.botSay("Enter Last Name:");
      this.step = 31;
      break;

    case 31:
      this.novData.lastName = reply;
      this.botSay("Enter Company Name:");
      this.step = 32;
      break;

    case 32:
      this.novData.company = reply;
      this.botSay("Enter Reason:");
      this.step = 4;
      break;

    // ------------------------ STEP 4: Reason --------------------------
    case 4:
      this.novData.reason = reply;

      // Show violation types
      this.botSay("Choose a Violation Type:");
      this.allViolationTypes.forEach((v, i) =>
        this.botSay(`${i + 1}. ${v.violationType}`)
      );

      this.step = 5;
      break;

    // --------------------- STEP 5: Violation Type ------------------------
    // --------------------- STEP 5: Violation Type ------------------------
case 5:
  const vIndex = parseInt(reply) - 1;
  const vSelected = this.allViolationTypes[vIndex];

  if (!vSelected) {
    this.botSay("Invalid choice. Try again.");
    return;
  }

  this.citation.violationTypeId = vSelected.id;
  this.botSay(`Selected: ${vSelected.violationType}`);

  // 🔥 Load citation reasons NOW
  this.GetCitationReasonListByViolation(vSelected.id);

  break;

    // --------------------- STEP 6: Citation Reason ------------------------
    case 6:
      const rIndex = parseInt(reply) - 1;
      const reason = this.allCitationReasonsList[rIndex];

      if (!reason) {
        this.botSay("Invalid reason. Try again.");
        return;
      }

      this.citation.citationResonId = reason.id;

      this.botSay(`Reason selected: ${reason.reason}`);
      this.botSay("Shall I submit this? (yes/no)");

      this.step = 7;
      break;

    // --------------------- STEP 7: Final Submission -----------------------
    case 7:
      if (reply.toLowerCase() === "yes") {
        this.botSay("Submitting NOV...");
        // TODO: Add API call
        this.botSay("NOV Submitted ✔️");
      } else {
        this.botSay("Submission canceled.");
      }

      this.step = 0;
      break;
  }
}


  formatDateToMMDDYYYY(dateString: string): string {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensures two digits
    const day = date.getDate().toString().padStart(2, "0"); // Ensures two digits
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      // console.log(value)
      const date = value.split("-");
      return {
        month: parseInt(date[0], 10),
        day: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  GetBadgeholderInfoASCX() {
    this.ascxuser = !this.ascxuser;
    var badgeNumber =
      this.badgeholder.badgeNumber === "" ? "0" : this.badgeholder.badgeNumber;
    if (this.badgeholder.badgeNumber != "") {
      if (this.badgeholder.badgeNumber != undefined) {
        this.readonlyBadge = true;
        this.citation.companyId = 0;
        this.NovService.GetBadgeByNumber(
          this.badgeholder.badgeNumber
        ).subscribe(
          (res) => {
            if (res && res.data && res.data.length > 0) {
              const data = res.data[0];
              if (data != null) {
                this.badgeholder = data as Badgeholder;
                this.citation.securityBadgeNo = this.badgeholder.badgeNumber;
                this.citation.violatorFirstName = this.badgeholder.firstName;
                this.citation.violatorLastName = this.badgeholder.lastName;
                this.citation.address = this.badgeholder.streetAddress;
                this.citation.state = this.badgeholder.state;
                this.citation.city = this.badgeholder.city;
                this.citation.driversLicenseNo =
                  this.badgeholder.driversLicenseNo;
                this.citation.zip = this.badgeholder.zip;
                this.citation.licenseState = this.badgeholder.licenseState;
                this.citation.isBadgeAutoFilled = true;

                this.badgeholder.birthDate = this.formatDateToMMDDYYYY(
                  this.badgeholder.birthDate
                );
                this.badgeholder.birthDate = this.dateAdapter.toModel(
                  this.fromModel(this.badgeholder.birthDate)
                );

                this.citation.email = this.badgeholder.emailAddress;
                this.citation.phone = this.badgeholder.mobileNumber;
                var company = this.allCompanyList.find(
                  (x) => x.companyName == this.badgeholder.company
                );
                if (company !== undefined) {
                  this.citation.companyId = company.id;
                  this.isCompany = true;
                } else {
                  //this.spinner.hide();
                  this.isCompany = true;
                  this.citation.companyId = null;
                  if (this.badgeholder.company !== null) {
                    this.toastr.error(
                      "The company " +
                        '"' +
                        this.badgeholder.company +
                        '"' +
                        " is not defined in SEMS Application, please contact SBO.",
                      "Error"
                    );
                  } else {
                    this.toastr.error(
                      "Company associated with badge# " +
                        '"' +
                        this.badgeholder.badgeNo +
                        '"' +
                        " is not defined in SEMS Application, please contact SBO.",
                      "Error"
                    );
                  }
                }
              } else {
                //this.spinner.hide();
                this.toastr.warning(
                  "Security Badge # does not exist.",
                  "Error"
                );
                this.readonlyBadge = false;
                this.isCompany = false;
                this.clearBadgeholderInfo();
              }
            } else {
              this.toastr.warning("Security Badge # does not exist.", "Error");
              this.readonlyBadge = false;
              this.isCompany = false;
              this.clearBadgeholderInfo();
            }
          },
          (error: any) => {
            //this.spinner.hide();
            this.toastr.error(
              "Error while fetching Badgeholder information.",
              "Error"
            );
            this.clearBadgeholderInfo();
          }
        );
      } else {
        //this.spinner.hide();
        this.readonlyBadge = false;
        this.isCompany = false;
        this.clearBadgeholderInfo();
      }
    } else {
      //this.spinner.hide();
      this.readonlyBadge = false;
      this.isCompany = false;
      this.clearBadgeholderInfo();
    }
  }

  public clearBadgeholderInfo() {
    this.badgeholder.company = "";
    this.citation.companyId = null;
    this.badgeholder.firstName = "";
    this.badgeholder.lastName = "";
    this.badgeholder.dob = "";
    this.badgeholder.recpt_email_address = "";
    this.badgeholder.driversLicenseNo = "";
    this.badgeholder.state = "";
    this.badgeholder.licenseState;
    this.badgeholder.address = "";
    this.badgeholder.city = "";
    this.badgeholder.zip = "";
    this.badgeholder.emailAddress = "";
    this.badgeholder.birthDate = "";
    this.badgeholder.streetAddress = "";
    this.citation.phone = "";
  }
}
