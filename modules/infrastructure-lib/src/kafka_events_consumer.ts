

/*****
 License
 --------------
 Copyright © 2017 Bill & Melinda Gates Foundation
 The Mojaloop files are made available by the Bill & Melinda Gates Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 Contributors
 --------------
 This is the official list (alphabetical ordering) of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Gates Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.
 * Gates Foundation
 - Name Surname <name.surname@gatesfoundation.com>
 * Modusbox
 - Vijay Kumar Guthi <vijaya.guthi@modusbox.com>
 --------------
 ******/

"use strict";

import { MLKafkaConsumer, MLKafkaConsumerOptions } from '@mojaloop/platform-shared-lib-nodejs-kafka-client-lib'
import { IMessage } from "@mojaloop/platform-shared-lib-messaging-types-lib";
import { IEventsConsumer } from '@mojaloop/sdk-scheme-adapter-private-types-lib'
import { ILogger } from "@mojaloop/logging-bc-public-types-lib";

export class KafkaEventsConsumer implements IEventsConsumer {
    private _kafkaConsumer: MLKafkaConsumer;
    private _kafkaTopics: string[];
    private _logger: ILogger;
    private _handler: (message: IMessage) => Promise<void>

    constructor(consumerOptions: MLKafkaConsumerOptions, kafkaTopics: string[], handlerFn: (message: IMessage) => Promise<void>, logger: ILogger) {
        this._logger = logger;
        this._kafkaTopics = kafkaTopics;
        this._handler = handlerFn
        this._kafkaConsumer = new MLKafkaConsumer(consumerOptions, this._logger);
    }
    async init(): Promise<void> {
        this._kafkaConsumer.setCallbackFn(this._handler)
        this._kafkaConsumer.setTopics(this._kafkaTopics)
        await this._kafkaConsumer.connect()
    }

    async start(): Promise<void> {        
        await this._kafkaConsumer.start()
    }

    async destroy(): Promise<void> {
        await this._kafkaConsumer.destroy(false);
    }
}
