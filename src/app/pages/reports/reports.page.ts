import { UserService } from './../../services/user.service';
import { ToastService } from './../../services/toast.service';
import { ListsService } from './../../services/lists.service';
import { LoadingController } from '@ionic/angular';
import { TripService } from './../../services/trip.service';
import { Component, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import * as moment from 'moment';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  constructor(
    private tripService: TripService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private loadingCtrl: LoadingController,
    private listService: ListsService,
    private toastService: ToastService,
    private userService: UserService
  ) {}
  headerImageUrl = '';
  content = {
    content: [
      {
        columns: [
          {
            width: 'auto',
            bold: true,
            text: ['\nDriver names\n\n\n', 'Tractor Unit\n\n'],
          },
          {
            width: 'auto',
            bold: true,
            text: ['\nNDAWRE\nN DAWRE\n\n', '#205'],
          },
          {},
          {
            alignment: 'center',
            image: '',
            width: 110,
          },
          {},
          {
            alignment: 'right',
            width: 'auto',
            text: [
              '\n1/25/21\n\n',
              'Safe Speed Express Logistics Inc,\n',
              '435 N highview Ave, Elmhurst, IL 60126\n',
              '708 733 0303\n',
              'info@sselogistics.net\n\n',
            ],
          },
        ],
      },
      {
        style: 'tableExample',
        fontSize: 6,
        margin: [0, 10, 0, 5],
        table: null,
        layout: {
          defaultBorder: false,
          fillColor: function (rowIndex, node, columnIndex) {
            return rowIndex == 0
              ? '#4471c6'
              : rowIndex % 2 === 1
              ? '#dae0f3'
              : null;
          },
        },
      },
    ],
    defaultStyle: {
      columnGap: 25,
      fontSize: 8,
    },
  };
  filterForm: FormGroup;
  trailers = [];

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      startDate: new FormControl('', Validators.compose([Validators.required])),
      endDate: new FormControl('', Validators.compose([Validators.required])),
      unitNumber: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      tolls: new FormControl(true, Validators.compose([Validators.required])),
      miscExpenses: new FormControl(
        true,
        Validators.compose([Validators.required])
      ),
      fuels: new FormControl(true, Validators.compose([Validators.required])),
    });
    this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
      loadingEl.present();
      this.listService.getAllCombos().subscribe(
        (res: any) => {
          this.trailers = res.trailers;
          loadingEl.dismiss();
        },
        (err) => {
          loadingEl.dismiss();
        }
      );
    });
  }

  generateReport() {
    console.log(this.filterForm.value.endDate);
    let endDate = moment(this.filterForm.value.endDate)
      .add('1', 'days')
      .format('YYYY-MM-DD');
    console.log(endDate);

    if (this.filterForm.valid) {
      if (this.headerImageUrl) {
        this.loadingCtrl
          .create({ keyboardClose: true, message: 'Checking datas ...' })
          .then((loadingEl) => {
            loadingEl.present();
            this.tripService
              .getAllTripsByDate(
                new Date(this.filterForm.value.startDate.split('T')[0]),
                new Date(endDate),
                this.filterForm.value.unitNumber
              )
              .subscribe(
                (res: any) => {
                  loadingEl.dismiss();
                  console.log(res);
                  if (res.length > 0) {
                    this.loadReport(res);
                  } else {
                    this.alertService.showAlert(
                      'Empty dtas',
                      'No any trips made by selected trailer in the selected time period',
                      ['Okay']
                    );
                  }
                },
                (err) => {
                  loadingEl.dismiss();
                  console.log(err);

                  this.alertService.showFirebaseAlert(err);
                }
              );
          });
      } else {
        this.toastService.presentToast('Please upload header image');
      }
    } else {
      this.toastService.presentToast('Please fill all the datas');
    }
  }

  loadReport(res) {
    let table = {
      heights: 7,
      headerRows: 1,
      color: '#ffffff',
      widths: ['*', '*', '*', '*', '*', '*'],
      body: [
        [
          {
            text: 'DATE',
            color: '#ffffff',
          },
          {
            text: 'ORIGIN',
            color: '#ffffff',
          },
          {
            text: 'DESTINATION',
            color: '#ffffff',
          },
          {
            text: 'TRAILER#',
            color: '#ffffff',
          },
          {
            text: 'MANIFEST#',
            color: '#ffffff',
          },
          {
            text: 'MILES',
            color: '#ffffff',
          },
        ],
        [{}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}],
      ],
    };
    if (this.filterForm.value.fuels) {
      table.widths.push('*');
      table.body[0].push({
        text: 'FUELS',
        color: '#ffffff',
      });
      table.body[1].push({ text: '', color: '' });
      table.body[2].push({ text: '', color: '' });
    }
    if (this.filterForm.value.tolls) {
      table.widths.push('*');
      table.body[0].push({
        text: 'TOLLS',
        color: '#ffffff',
      });
      table.body[1].push({ text: '', color: '' });
      table.body[2].push({ text: '', color: '' });
    }
    if (this.filterForm.value.miscExpenses) {
      table.widths.push('*');
      table.body[0].push({
        text: 'MISC EXPENSES',
        color: '#ffffff',
      });
      table.body[1].push({ text: '', color: '' });
      table.body[2].push({ text: '', color: '' });
    }
    this.content.content[1].table = table;
    res.forEach((trip) => {
      let count = 0;
      let data = [
        moment(trip.date.toDate()).format('DD-MM-YYYY'),
        trip.origin,
        trip.destination,
        trip.trailerNumber,
        trip.manifestNumber,
        trip.miles,
      ];
      if (this.filterForm.value.fuels) {
        if (trip.fuelFillings.length > 0) {
          data.push(this.getCost(trip.fuelFillings));
        } else {
          data.push('0');
        }
        count = count + 1;
      }
      if (this.filterForm.value.tolls) {
        if (trip.tollPayments.length > 0) {
          data.push(this.getCost(trip.tollPayments));
        } else {
          data.push('0');
        }
        count = count + 1;
      }
      if (this.filterForm.value.miscExpenses) {
        if (trip.miscExpenses.length > 0) {
          data.push(this.getCost(trip.miscExpenses));
        } else {
          data.push('0');
        }
        count = count + 1;
      }
      this.content.content[1].table.body.push(data);
      let emptyData = [{}, {}, {}, {}, {}, {}];
      for (let i = 0; i < count; i++) {
        emptyData.push({});
      }
      this.content.content[1].table.body.push(emptyData);
      this.content.content[0].columns[5].text[0] =
        '\n' + moment(new Date()).format('DD-MM-YYYY') + '\n\n';
    });
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Loading datas ...' })
      .then((loadingEl) => {
        loadingEl.present();
        this.userService.getUserDetailsById(res[0].addedBy).subscribe(
          (resp) => {
            this.content.content[0].columns[1].text = [
              '\n' + resp.name + '\n' + res[0].teamMate + '\n\n',
              '#' + res[0].unitNumber,
            ];
            var dd = this.content;
            loadingEl.dismiss();
            pdfMake.createPdf(dd).open();
          },
          (err) => {
            loadingEl.dismiss();
            this.alertService.showFirebaseAlert(err);
          }
        );
      });
  }

  loadImageFromDevice(event) {
    let verifyUpload = event.target.files.length;
    console.log(event);

    let uploadedFile = event.target.files[0];
    const reader = new FileReader();

    reader.readAsArrayBuffer(uploadedFile);

    reader.onload = async () => {
      // get the blob of the image:
      var base64data: any = reader.result;
      this.headerImageUrl = base64data;

      // let blob: Blob = new Blob([reader.result as ArrayBuffer], {
      //   type: 'application/pdf',
      // });
      // console.log('blob', blob);
      // this.headerImageUrl = URL.createObjectURL(blob);
      this.content.content[0].columns[3].image = base64data;
    };
  }
  getCost(res: any) {
    let totalCost = 0;
    res.forEach((item) => {
      totalCost = totalCost + parseInt(item.cost);
    });
    return totalCost;
  }
  //footer color #ffeaa1, text = #b07c26
}
