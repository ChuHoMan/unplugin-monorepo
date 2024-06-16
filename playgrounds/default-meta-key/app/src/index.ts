import { bar as Bar, foo } from '@test/default-meta-key-lib';
import { foo as DeepFoo } from '@test/default-meta-key-lib/foo';

import { bar } from '@test/default-meta-key-lib2';

foo();
DeepFoo();
Bar();
bar();
