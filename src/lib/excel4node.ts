import axios from 'axios';

export interface CellStyles {
  alignment?: {
    // §18.8.1
    horizontal?:
      | 'center'
      | 'centerContinuous'
      | 'distributed'
      | 'fill'
      | 'general'
      | 'justify'
      | 'left'
      | 'right';
    indent?: number; // Number of spaces to indent = indent value * 3
    justifyLastLine?: boolean;
    readingOrder?: 'contextDependent' | 'leftToRight' | 'rightToLeft';
    relativeIndent?: number; // number of additional spaces to indent
    shrinkToFit?: boolean;
    textRotation?: number; // number of degrees to rotate text counter-clockwise
    vertical?: 'bottom' | 'center' | 'distributed' | 'justify' | 'top';
    wrapText?: boolean;
  };
  font?: {
    // §18.8.22
    bold?: boolean;
    charset?: number;
    color?: string;
    condense?: boolean;
    extend?: boolean;
    family?: string;
    italics?: boolean;
    name?: string;
    outline?: boolean;
    scheme?: string; // §18.18.33 ST_FontScheme (Font scheme Styles)
    shadow?: boolean;
    strike?: boolean;
    size?: number;
    underline?: boolean;
    vertAlign?: string; // §22.9.2.17 ST_VerticalAlignRun (Vertical Positioning Location)
  };
  border?: {
    // §18.8.4 border (Border)
    left?: {
      style?: string; //§18.18.3 ST_BorderStyle (Border Line Styles) ['none', 'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
      color?: string; // HTML style hex value
    };
    right?: {
      style?: string;
      color?: string;
    };
    top?: {
      style?: string;
      color?: string;
    };
    bottom?: {
      style?: string;
      color?: string;
    };
    diagonal?: {
      style?: string;
      color?: string;
    };
    diagonalDown?: boolean;
    diagonalUp?: boolean;
    outline?: boolean;
  };
  fill?: {
    // §18.8.20 fill (Fill)
    type?: string; // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
    patternType?: string; //§18.18.55 ST_PatternType (Pattern Type)
    bgColor?: string; // HTML style hex value. defaults to black
    fgColor?: string; // HTML style hex value. defaults to black.
  };
  numberFormat?: number | string; // §18.8.30 numFmt (Number Format)
}

interface ResgisteOptions {
  headerSize?: {
    width?: number;
    height?: number;
  };
  headerStyle?: CellStyles;
  numberStyle?: CellStyles;
  stringStyle?: CellStyles;
  objectStyle?: CellStyles;
  imageSize?: {
    width: number;
    height: number;
  };
}

const headerSize: { width: number; height: number } = {
  width: 15,
  height: 40,
};

const headerStyle: CellStyles = {
  alignment: {
    horizontal: 'center',
    vertical: 'center',
  },
  fill: {
    type: 'pattern',
    patternType: 'solid',
    bgColor: '#F23655',
    fgColor: '#F23655',
  },
};

const stringStyle: CellStyles = {
  alignment: {
    wrapText: true,
    horizontal: 'left',
    vertical: 'top',
  },
};

const numberStyle: CellStyles = {
  numberFormat: '#,##0',
  alignment: {
    horizontal: 'center',
    vertical: 'center',
  },
};

const imageSize: { width: number; height: number } = {
  width: 200,
  height: 100,
};

/**
 * excel4node 모듈 사용
 * https://www.npmjs.com/package/excel4node
 */
export class Excel4Node {
  wb: any;
  imageBuffer = [];

  headerStyle;

  constructor() {
    const xl = require('excel4node');
    // // Create a new instance of a Workbook class
    this.wb = new xl.Workbook();
  }

  setHeaderStyle(style) {
    this.headerStyle = style;
  }

  addWorkSheet(title: string) {
    // Add Worksheets to the workbook

    const ws = this.wb.addWorksheet(title);

    return ws;
  }

  /** 데이터 등록하기
   * @param sheet 시트
   * @param items 등록할 아이템 데이터
   * @param options 옵션
   */
  registe(sheet, items: Array<any>, options?: ResgisteOptions) {
    // header 넒비 너비 설정
    sheet.column(1).setWidth(options?.headerSize?.width || headerSize.width);
    sheet.row(1).setHeight(options?.headerSize?.height || headerSize.height);

    // header key 값들 쓰기
    const itemHeader = Object.keys(items[0]);
    itemHeader.forEach((v, i) => {
      sheet
        .cell(1, i + 1)
        .string(v)
        .style(options.headerStyle || headerStyle);
    });

    // 데이터 쓰기
    items.forEach((item, index) => {
      const data = Object.values(item);
      data.forEach((v: any, i) => {
        const row = 2 + index;
        const col = i + 1;

        if (typeof v === 'object') {
          // 오브젝트
          sheet
            .cell(row, col)
            .string(JSON.stringify(v))
            .style(options.objectStyle || stringStyle);
        } else if (typeof v === 'number') {
          // 넘버
          sheet
            .cell(row, col)
            .number(v)
            .style(options.numberStyle || numberStyle);
        } else if (new RegExp(/(\.gif|\.jpg|\.jpeg|\.png)$/).test(v)) {
          // 이미지
          this.imageBuffer.push(
            this.#sheetAddImage(
              sheet,
              v,
              col,
              row,
              options?.imageSize?.width || imageSize.width,
              options?.imageSize?.height || imageSize.height,
            ),
          );
        } else {
          // 문자
          sheet
            .cell(row, col)
            .string(v)
            .style(options.stringStyle || stringStyle);
        }
      });
    });
  }

  async write(fileName: string) {
    try {
      await Promise.all(this.imageBuffer);
      this.wb.write(`IrecepitRecord/${fileName}.xlsx`);
      return true;
    } catch {
      return false;
    }
  }

  async #sheetAddImage(
    sheet,
    url: string,
    col,
    row,
    width: number,
    height: number,
  ) {
    const marginX = 4;
    const marginY = 8;

    const res = await axios.get(
      url.replace('upload/', `upload/w_${width},h_${height}/`),
      {
        responseType: 'arraybuffer',
      },
    );
    const buffer = Buffer.from(res.data, 'utf-8');

    sheet.column(col).setWidth(width * 0.13 + marginX);
    sheet.row(row).setHeight(height * 0.8 + marginY);

    sheet.addImage({
      image: buffer,
      type: 'picture',
      position: {
        type: 'oneCellAnchor',
        from: {
          col,
          colOff: `${marginX * 0.05}in`,
          row,
          rowOff: `${marginY * 0.012}in`,
        },
      },
    });
  }
}
