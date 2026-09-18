import IntegrityDatastoreClient from '../data/integrityDatastoreClient'

export default class EmDatastoreConnectionService {
  constructor(private readonly integrityDatastoreClient: IntegrityDatastoreClient) {}

  async test(token: string): Promise<JSON> {
    return this.integrityDatastoreClient.testConnection(token)
  }
}
