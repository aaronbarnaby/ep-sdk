import { CRUDExtend, mergeTypeIntoBody } from '../../extends/crud';
import type { ResolvedElasticPathConfig } from '../../types';
import { buildURL } from '../../utils/helpers';
import type {
  CreateVariationBody,
  UpdateVariationBody,
  UpdateVariationOptionBody,
  VariationModifierPage,
  VariationModifierResource,
  VariationOptionBase,
  VariationOptionPage,
  VariationOptionResource,
  VariationPage,
  VariationResource,
  VariationsModifier,
} from './types';

export class VariationsEndpoint extends CRUDExtend<
  VariationResource,
  VariationPage,
  CreateVariationBody,
  UpdateVariationBody
> {
  constructor(config: ResolvedElasticPathConfig) {
    super({
      ...config,
      version: 'pcm',
    });

    this.endpoint = 'variations';
    this.resourceType = 'product-variation';
    this.updateMethod = 'PUT';
  }

  CreateVariation(body: CreateVariationBody, token?: string) {
    return this.Create(body, token);
  }

  UpdateVariation(id: string, body: UpdateVariationBody, token?: string) {
    return this.Update(id, body, token);
  }

  VariationsOption(variationId: string, optionId: string, token?: string) {
    const response = this.request.send<VariationOptionResource>(
      `${this.endpoint}/${variationId}/options/${optionId}`,
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  Option(variationId: string, optionId: string, token?: string) {
    return this.VariationsOption(variationId, optionId, token);
  }

  VariationsOptions(variationId: string, token?: string) {
    const response = this.request.send<VariationOptionPage>(
      buildURL(`${this.endpoint}/${variationId}/options`, this.getParams()),
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  Options(variationId: string, token?: string) {
    return this.VariationsOptions(variationId, token);
  }

  CreateVariationsOption(variationId: string, body: VariationOptionBase, token?: string) {
    const response = this.request.send<VariationOptionResource>(
      `${this.endpoint}/${variationId}/options`,
      'POST',
      {
        body: mergeTypeIntoBody(body, 'product-variation-option'),
        token,
      },
    );
    this.resetProps();

    return response;
  }

  CreateOption(variationId: string, body: VariationOptionBase, token?: string) {
    return this.CreateVariationsOption(variationId, body, token);
  }

  UpdateVariationsOption(
    variationId: string,
    optionId: string,
    body: UpdateVariationOptionBody,
    token?: string,
  ) {
    const response = this.request.send<VariationOptionResource>(
      `${this.endpoint}/${variationId}/options/${optionId}`,
      'PUT',
      {
        body: mergeTypeIntoBody(body, 'product-variation-option'),
        token,
      },
    );
    this.resetProps();

    return response;
  }

  UpdateOption(
    variationId: string,
    optionId: string,
    body: UpdateVariationOptionBody,
    token?: string,
  ) {
    return this.UpdateVariationsOption(variationId, optionId, body, token);
  }

  DeleteVariationsOption(variationId: string, optionId: string, token?: string) {
    const response = this.request.send<void>(
      `${this.endpoint}/${variationId}/options/${optionId}`,
      'DELETE',
      {
        token,
      },
    );
    this.resetProps();

    return response;
  }

  DeleteOption(variationId: string, optionId: string, token?: string) {
    return this.DeleteVariationsOption(variationId, optionId, token);
  }

  VariationsModifier(variationId: string, optionId: string, modifierId: string, token?: string) {
    const response = this.request.send<VariationModifierResource>(
      `${this.endpoint}/${variationId}/options/${optionId}/modifiers/${modifierId}`,
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  Modifier(variationId: string, optionId: string, modifierId: string, token?: string) {
    return this.VariationsModifier(variationId, optionId, modifierId, token);
  }

  VariationsModifiers(variationId: string, optionId: string, token?: string) {
    const response = this.request.send<VariationModifierPage>(
      `${this.endpoint}/${variationId}/options/${optionId}/modifiers`,
      'GET',
      { token },
    );
    this.resetProps();

    return response;
  }

  Modifiers(variationId: string, optionId: string, token?: string) {
    return this.VariationsModifiers(variationId, optionId, token);
  }

  CreateVariationsModifier(
    variationId: string,
    optionId: string,
    body: VariationsModifier,
    token?: string,
  ) {
    const response = this.request.send<VariationModifierResource>(
      `${this.endpoint}/${variationId}/options/${optionId}/modifiers`,
      'POST',
      {
        body: mergeTypeIntoBody(body, 'product-variation-modifier'),
        token,
      },
    );
    this.resetProps();

    return response;
  }

  CreateModifier(variationId: string, optionId: string, body: VariationsModifier, token?: string) {
    return this.CreateVariationsModifier(variationId, optionId, body, token);
  }

  UpdateVariationsModifier(
    variationId: string,
    optionId: string,
    modifierId: string,
    body: VariationsModifier,
    token?: string,
  ) {
    const response = this.request.send<VariationModifierResource>(
      `${this.endpoint}/${variationId}/options/${optionId}/modifiers/${modifierId}`,
      'PUT',
      {
        body: mergeTypeIntoBody(
          {
            ...body,
            id: modifierId,
          },
          'product-variation-modifier',
        ),
        token,
      },
    );
    this.resetProps();

    return response;
  }

  UpdateModifier(
    variationId: string,
    optionId: string,
    modifierId: string,
    body: VariationsModifier,
    token?: string,
  ) {
    return this.UpdateVariationsModifier(variationId, optionId, modifierId, body, token);
  }

  DeleteVariationsModifier(
    variationId: string,
    optionId: string,
    modifierId: string,
    token?: string,
  ) {
    const response = this.request.send<void>(
      `${this.endpoint}/${variationId}/options/${optionId}/modifiers/${modifierId}`,
      'DELETE',
      { token },
    );
    this.resetProps();

    return response;
  }

  DeleteModifier(variationId: string, optionId: string, modifierId: string, token?: string) {
    return this.DeleteVariationsModifier(variationId, optionId, modifierId, token);
  }
}
