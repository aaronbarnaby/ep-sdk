import { CRUDExtend, mergeTypeIntoBody } from '../../extends/crud';
import { BaseExtend } from '../../extends/base';
import type { ResolvedElasticPathConfig } from '../../types';
import { buildURL } from '../../utils/helpers';
import type {
  CreatePriceBookBody,
  CreatePriceBookPriceBody,
  CreatePriceBookPriceModifierBody,
  PriceBookFilter,
  PriceBookImportJobResource,
  PriceBookInclude,
  PriceBookPage,
  PriceBookPriceFilter,
  PriceBookPriceModifierFilter,
  PriceBookPriceModifierPage,
  PriceBookPriceModifierResource,
  PriceBookPricePage,
  PriceBookPriceResource,
  PriceBookResource,
  PriceBookSort,
  UpdatePriceBookBody,
  UpdatePriceBookPriceBody,
  UpdatePriceBookPriceModifierBody,
} from './types';

export class PriceBookPricesEndpoint extends BaseExtend<
  PriceBookPriceResource,
  PriceBookPricePage,
  PriceBookPriceFilter
> {
  constructor(config: ResolvedElasticPathConfig) {
    super({
      ...config,
      version: 'pcm',
    });

    this.endpoint = 'prices';
  }

  All<TResponse = PriceBookPricePage>(pricebookId: string, token?: string): Promise<TResponse> {
    const response = this.request.send<TResponse>(
      buildURL(`pricebooks/${pricebookId}/${this.endpoint}`, {
        limit: this.limit,
        offset: this.offset,
        filter: this.filter,
      }),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  Get<TResponse = PriceBookPriceResource>(
    pricebookId: string,
    priceId: string,
    token?: string,
  ): Promise<TResponse> {
    const response = this.request.send<TResponse>(
      `pricebooks/${pricebookId}/${this.endpoint}/${priceId}`,
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  Create(pricebookId: string, body: CreatePriceBookPriceBody, token?: string) {
    const response = this.request.send<PriceBookPriceResource>(
      `pricebooks/${pricebookId}/${this.endpoint}`,
      'POST',
      {
        body: mergeTypeIntoBody(body, 'product-price'),
        token,
      },
    );
    this.resetProps();

    return response;
  }

  Update(pricebookId: string, priceId: string, body: UpdatePriceBookPriceBody, token?: string) {
    const response = this.request.send<PriceBookPriceResource>(
      `pricebooks/${pricebookId}/${this.endpoint}/${priceId}`,
      'PUT',
      {
        body: mergeTypeIntoBody(body, 'product-price'),
        token,
      },
    );
    this.resetProps();

    return response;
  }

  Delete(pricebookId: string, priceId: string, token?: string) {
    const response = this.request.send<void>(
      `pricebooks/${pricebookId}/${this.endpoint}/${priceId}`,
      'DELETE',
      {
        token,
      },
    );
    this.resetProps();

    return response;
  }
}

export class PriceBookPriceModifiersEndpoint extends BaseExtend<
  PriceBookPriceModifierResource,
  PriceBookPriceModifierPage,
  PriceBookPriceModifierFilter
> {
  constructor(config: ResolvedElasticPathConfig) {
    super({
      ...config,
      version: 'pcm',
    });

    this.endpoint = 'modifiers';
  }

  All<TResponse = PriceBookPriceModifierPage>(
    pricebookId: string,
    token?: string,
  ): Promise<TResponse> {
    const response = this.request.send<TResponse>(
      buildURL(`pricebooks/${pricebookId}/${this.endpoint}`, {
        limit: this.limit,
        offset: this.offset,
        filter: this.filter,
      }),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  Get<TResponse = PriceBookPriceModifierResource>(
    pricebookId: string,
    priceModifierId: string,
    token?: string,
  ): Promise<TResponse> {
    const response = this.request.send<TResponse>(
      `pricebooks/${pricebookId}/${this.endpoint}/${priceModifierId}`,
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  Create(pricebookId: string, body: CreatePriceBookPriceModifierBody, token?: string) {
    const response = this.request.send<PriceBookPriceModifierResource>(
      `pricebooks/${pricebookId}/${this.endpoint}`,
      'POST',
      {
        body: mergeTypeIntoBody(body, 'price-modifier'),
        token,
      },
    );
    this.resetProps();

    return response;
  }

  Update(
    pricebookId: string,
    priceModifierId: string,
    body: UpdatePriceBookPriceModifierBody,
    token?: string,
  ) {
    const response = this.request.send<PriceBookPriceModifierResource>(
      `pricebooks/${pricebookId}/${this.endpoint}/${priceModifierId}`,
      'PUT',
      {
        body: mergeTypeIntoBody(body, 'price-modifier'),
        token,
      },
    );
    this.resetProps();

    return response;
  }

  Delete(pricebookId: string, priceModifierId: string, token?: string) {
    const response = this.request.send<void>(
      `pricebooks/${pricebookId}/${this.endpoint}/${priceModifierId}`,
      'DELETE',
      { token },
    );
    this.resetProps();

    return response;
  }
}

export class PriceBooksEndpoint extends CRUDExtend<
  PriceBookResource,
  PriceBookPage,
  CreatePriceBookBody,
  UpdatePriceBookBody,
  PriceBookFilter,
  PriceBookSort,
  PriceBookInclude
> {
  readonly Prices: PriceBookPricesEndpoint;
  readonly PriceModifiers: PriceBookPriceModifiersEndpoint;

  constructor(config: ResolvedElasticPathConfig) {
    const endpointConfig: ResolvedElasticPathConfig = {
      ...config,
      version: 'pcm',
    };

    super(endpointConfig);

    this.endpoint = 'pricebooks';
    this.resourceType = 'pricebook';
    this.updateMethod = 'PUT';
    this.Prices = new PriceBookPricesEndpoint(endpointConfig);
    this.PriceModifiers = new PriceBookPriceModifiersEndpoint(endpointConfig);
  }

  ImportProductPrices(file: FormData, token?: string) {
    const response = this.request.send<PriceBookImportJobResource>(
      `${this.endpoint}/import`,
      'POST',
      {
        body: file,
        token,
      },
    );
    this.resetProps();

    return response;
  }
}
