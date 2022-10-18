import { expectType } from "tsd";
import {
	Service,
	ServiceBroker,
	ServiceAction,
	ServiceActions,
	ServiceSchema,
	ServiceType,
	ServiceSchemaWrapper,
	Context
} from "../../../index";

const broker = new ServiceBroker({ logger: false, transporter: "fake" });

interface TestSchema extends ServiceSchema {
	actions: {
		foo: { handler: (ctx: Context<any>) => any };
		bar: (ctx: Context<{ t: string }>) => number;
	};
}

class TestService extends Service<TestSchema> {
	constructor(broker: ServiceBroker) {
		super(broker);

		this.parseServiceSchema({
			name: "test1",
			actions: {
				foo: {
					async handler() {
						expectType<ServiceType<TestSchema>>(this);
						expectType<ServiceActions<TestSchema>>(testService.actions);
					}
				},
				bar() {
					this.actions.foo(); // check `this` ref in `foo`, should not throw error;

					expectType<ServiceType<TestSchema>>(this);
					expectType<ServiceActions<TestSchema>>(testService.actions);
				}
			}
		} as ServiceSchemaWrapper<TestSchema>);
	}
}

type tt = TestService["actions"];
const testService = new TestService(broker);

expectType<ServiceActions<TestSchema>>(testService.actions);
expectType<ServiceAction<any, any>>(testService.actions.foo);
expectType<ServiceAction<number, { t: string }>>(testService.actions.bar);
