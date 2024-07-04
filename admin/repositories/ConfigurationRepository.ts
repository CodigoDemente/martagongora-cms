import { KeystoneContext } from '@keystone-6/core/types';
import { Configuration } from '../types/configuration';
import { ConfigurationNotFound } from '../errors/ConfigurationNotFound';

export class ConfigurationRepository {
	constructor(private readonly context: KeystoneContext) {}

	public async getConfiguration<T extends Record<string, unknown>>(
		name: string,
		internal: boolean = false
	): Promise<Configuration<T>> {
		let finalData: Configuration<T>;

		if (internal) {
			const data = await this.context.prisma.configuration.findUnique({
				where: { name }
			});

			if (!data) {
				throw new ConfigurationNotFound(name);
			}

			const parsedValue: T = JSON.parse(data.value as string);

			finalData = {
				name: data.name,
				value: parsedValue
			};
		} else {
			const data = await this.context.query.Configuration.findOne({
				where: { name }
			});

			if (!data) {
				throw new ConfigurationNotFound(name);
			}

			finalData = {
				name: data.name,
				value: data.value as T
			};
		}

		return finalData;
	}

	public async deleteConfiguration(name: string, internal: boolean = false): Promise<void> {
		if (internal) {
			await this.context.prisma.configuration.delete({
				where: { name }
			});
		} else {
			await this.context.query.Configuration.deleteOne({
				where: { name }
			});
		}
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
