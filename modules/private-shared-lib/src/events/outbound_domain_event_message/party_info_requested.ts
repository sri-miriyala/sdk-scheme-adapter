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
 - Yevhen Kyriukha <yevhen.kyriukha@modusbox.com>
 --------------
 ******/

'use strict';

import { DomainEventMessage } from '../domain_event_message';
import { IMessageHeader } from '@mojaloop/platform-shared-lib-messaging-types-lib';
import { IHttpRequest } from '../../types';
import { OutboundDomainEventMessageName } from '.';

export interface IPartyInfoRequestedMessageData {
    bulkId: string;
    transferId: string;
    request: IHttpRequest;
    timestamp: number | null;
    headers: IMessageHeader[] | null;
}

export class PartyInfoRequestedMessage extends DomainEventMessage {
    constructor(data: IPartyInfoRequestedMessageData) {
        super({
            key: `${data.bulkId}_${data.transferId}`,
            content: data.request,
            timestamp: data.timestamp,
            headers: data.headers,
            name: OutboundDomainEventMessageName.PartyInfoRequested,
        });
    }

    getBulkId() {
        return this.getKey().split('_')[0];
    }

    getTransferId() {
        return this.getKey().split('_')[1];
    }

    // For SDK outbound API
    // static CreateFromDomainEventMessage(message: DomainEventMessage): PartyInfoRequestedMessage {
    //     if((message.getContent() === null || typeof message.getContent() !== 'object')) {
    //         throw new Error('Content is in unknown format');
    //     }
    //     const data: IPartyInfoRequestedMessageData = {
    //         request: <PartyInfoRequestedState>message.getContent(),
    //         timestamp: message.getTimeStamp(),
    //         headers: message.getHeaders(),
    //     };
    //     return new PartyInfoRequestedMessage(data);
    // }
}
