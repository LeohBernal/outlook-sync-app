import { Injectable } from '@nestjs/common';
import { client, indexes } from '../database.config';
import { DatabaseMailsService } from './database.mails.service';
import { Mail } from 'src/modules/mails/entity';
import { GetPlatformMailDTO } from 'src/modules/mails/dto';

@Injectable()
export class DatabaseMailsServiceImpl implements DatabaseMailsService {
  private readonly MAILS_INDEX = indexes.mails;

  public async createMultiple(
    mails: GetPlatformMailDTO[],
    userId: string,
    mailboxId: string,
  ): Promise<void> {
    const bulk = mails.flatMap(({ id, ...mail }) => [
      {
        index: {
          _index: this.MAILS_INDEX,
          _id: id,
        },
      },
      {
        ...mail,
        userId,
        mailboxId,
        isDeleted: false,
      },
    ]);
    await client.bulk({ body: bulk });
  }

  public async update({ id, ...mail }: GetPlatformMailDTO): Promise<void> {
    await client.update({
      index: this.MAILS_INDEX,
      body: {
        doc: mail,
      },
      id,
    });
  }

  public async updateIsDeletedById(id: string): Promise<void> {
    await client.update({
      index: this.MAILS_INDEX,
      id,
      body: {
        doc: {
          isDeleted: true,
        },
      },
    });
  }

  public async findById(id: string): Promise<Mail> {
    try {
      const response = await client.get<Omit<Mail, 'id'>>({
        index: this.MAILS_INDEX,
        id,
      });
      return {
        ...response._source,
        id: response._id,
      };
    } catch (error) {
      return null;
    }
  }

  public async findPaginatedByMailboxId(
    mailboxId: string,
    page: number = 0,
    size: number = 10,
  ): Promise<Mail[]> {
    try {
      const {
        hits: { hits },
      } = await client.search<Omit<Mail, 'id'>>({
        index: this.MAILS_INDEX,
        body: {
          from: page * size,
          size: size,
          sort: [{ receivedDateTime: { order: 'desc' } }],
          query: {
            match: {
              mailboxId,
            },
          },
        },
      });

      return hits.map(({ _source, _id }) => ({
        ..._source,
        id: _id,
      }));
    } catch (error) {
      return [];
    }
  }
}
