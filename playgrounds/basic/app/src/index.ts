import { bar as Bar, foo } from '@test/lib';

import { bar } from '@test/lib/bar';
import { clsx } from 'clsx';

foo();
Bar();
bar();
console.log(clsx('foo', 'bar'));
