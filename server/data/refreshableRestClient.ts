import { ApiConfig } from "../config";
import HmppsAuthClient from "./hmppsAuthClient";
import RestClient from "./restClient";

export class RefreshableRestClient extends RestClient {

    constructor(
        name: string,
        config: ApiConfig,
        private readonly authClient: HmppsAuthClient
      ) {
        super(name, config, '');
      }

    async refreshToken() {
        this.token = await this.authClient.getSystemClientToken()
    }

}