import type { Request, RequestHandler, Response } from 'express'

type PlacesOfInterestTimePeriod = {
  start: string
  end: string
}

type PlacesOfInterestTableProps = {
  location: string
  date: string
  timePeriod: PlacesOfInterestTimePeriod
  route: number[][]
}

const routes: PlacesOfInterestTableProps[] = [
  {
    location: 'Pub',
    date: '2025-01-22',
    timePeriod: {
      start: '19:00',
      end: '22:34',
    },
    route: [
      [51.574865, 0.060977],
      [51.573711, 0.0544],
      [51.576219, 0.052309],
    ],
  },
  {
    location: 'Casino',
    date: '2025-02-23',
    timePeriod: {
      start: '22:30',
      end: '02:19',
    },
    route: [
      [51.574865, 0.060977],
      [51.575927, 0.064818],
      [51.576325, 0.066015],
      [51.577023515963425, 0.06845203800859329],
    ],
  },
  {
    location: 'Betting Shop',
    date: '2024-01-25',
    timePeriod: {
      start: '19:00',
      end: '20:34',
    },
    route: [
      [51.574865, 0.060977],
      [51.574153, 0.058536],
      [51.574014, 0.057637],
      [51.574778, 0.05756],
      [51.574767464197905, 0.05884026261579327],
    ],
  },
  {
    location: 'Hospital',
    date: '2024-01-23',
    timePeriod: {
      start: '20:35',
      end: '05:11',
    },
    route: [
      [51.574865, 0.060977],
      [51.574153, 0.058536],
      [51.573248244162706, 0.05111371418603764],
      [51.574622, 0.048643],
      [51.57610341773559, 0.048391168020475],
      [51.576400900843375, 0.045439341454295505],
    ],
  },
]

export default class SearchController {
  constructor() {}

  map: RequestHandler = async (req: Request, res: Response) => {
    const { legacySubjectId } = req.params

    res.render('pages/mapping', {
      legacySubjectId,
      backUrl: `/integrity/${legacySubjectId}`,
      routes,
    })
  }
}
