import { PDFDocument, StandardFonts } from 'pdf-lib'
import download from 'downloadjs'
import { getPlayerById } from '../api/players'

import dayjs from 'dayjs'
import 'dayjs/locale/es'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.locale('es')
dayjs.extend(customParseFormat)

import reglamento from '../assets/docs/equipamiento.pdf'

export const usePDFEquipamiento = () => {
  const downloadPDFEquipamiento = async (data) => {
    const existingPdfBytes = await fetch(reglamento).then((res) =>
      res.arrayBuffer()
    )

    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const drawText = (text, x, y) => {
      firstPage.drawText(text, {
        x,
        y,
        size: 10,
        font
      })
    }

    const drawTextFecha = (text, x, y) => {
      firstPage.drawText(text, {
        x,
        y,
        size: 11,
        font
      })
    }

    const player = await getPlayerById(data.jugadorId.value)
    const fecha = dayjs(data.fecha_asignacion, 'DD/MM/YYYY').format(
      'D [de] MMMM [de] YYYY'
    )

    drawText(data.jugador, 258, 675)
    drawText(player.categoria, 258, 643)
    drawText(player.temporadaId?.label || 'NA', 258, 609)
    drawText(player.direccion, 258, 574)
    drawText(player.telefono, 258, 543)
    drawText(player.uid.label, 258, 514)
    drawText(fecha, 258, 481)

    const drawWrappedText = (text, x, y, maxWidth, lineHeight) => {
      const words = text.split(' ')
      let line = ''
      let offsetY = 0

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' '
        const testWidth = font.widthOfTextAtSize(testLine, 10)

        if (testWidth > maxWidth && i > 0) {
          drawText(line.trim(), x, y - offsetY)
          line = words[i] + ' '
          offsetY += lineHeight
        } else {
          line = testLine
        }
      }

      if (line) {
        drawText(line.trim(), x, y - offsetY)
      }
    }

    drawWrappedText(data.equipo_prestado, 215, 387, 250, 14)

    drawTextFecha(dayjs().format('D [de] MMMM [de] YYYY'), 235, 106)

    const nombreDocumento = `pagare_equipamiento_${dayjs().format(
      'DD-MM-YYYY'
    )}.pdf`
    const pdfBytes = await pdfDoc.save()
    download(pdfBytes, nombreDocumento, 'application/pdf')
  }

  return { downloadPDFEquipamiento }
}
