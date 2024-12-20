import path from 'node:path';
import { Svg } from '@html/components/Svg.tsx';
import { jsx } from 'jsx';

const cwd = Deno.cwd();

export function Check(props?: object)
{
	return <Svg {...props} src={path.join(cwd, 'static/images/icons/check.svg')} />
}

export function Exit(props?: object)
{
	return <Svg {...props} src={path.join(cwd, 'static/images/icons/exit.svg')} />
}

export function OpenExternal(props?: object)
{
	return <Svg {...props} src={path.join(cwd, 'static/images/icons/open-external.svg')} />
}

export function Pencil(props?: object)
{
	return <Svg {...props} src={path.join(cwd, 'static/images/icons/pencil.svg')} />
}
