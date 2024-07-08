import { KeystoneContext } from '@keystone-6/core/types';
import { Configuration } from '../types/configuration';
import { ConfigurationNotFound } from '../errors/ConfigurationNotFound';

export class ConfigurationRepository {
	constructor(private readonly context: KeystoneContext) {}

	public async getConfiguration<T extends Record<string, unknown>>(
		name: string
	): Promise<Configuration<T>> {
		const data = await this.context.query.Configuration.findOne({
			where: { name },
			query: 'name value'
		});

		if (!data) {
			throw new ConfigurationNotFound(name);
		}

		return {
			name: data.name,
			value: data.value as T
		};
	}

	public async deleteConfiguration(name: string): Promise<void> {
		await this.context.query.Configuration.deleteOne({
			where: { name }
		});
	}

	public async createConfiguration<T extends Record<string, unknown>>(
		name: string,
		value: T
	): Promise<void> {
		await this.context.query.Configuration.createOne({
			data: {
				name,
				value
			},
			query: 'name'
		});
	}

	public async updateConfiguration<T extends Record<string, unknown>>(
		name: string,
		value: T
	): Promise<void> {
		await this.context.query.Configuration.updateOne({
			where: { name },
			data: { value },
			query: 'name'
		});
	}
}
