import axios from 'axios'
import appConfig from '../../../config/config'

export const getPlaces = async (query: string) => {
    const key = appConfig.openCageDataKey
    const url = `https://api.opencagedata.com/geocode/v1/geojson?q=${query}&key=${key}&limit=20&no_annotations=1`
    const response = await axios.get(url)
    return response.data
}
