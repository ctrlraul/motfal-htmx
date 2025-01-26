import * as path from 'path';
import { Svg } from '@html/components/Svg';
import { jsx } from '@jsx';

export function Check(props?: object)
{
	return <Svg {...props} src={path.join(process.cwd(), '/static/images/icons/check.svg')} />
}

export function Enter(props?: object)
{
	return <Svg {...props} src={path.join(process.cwd(), '/static/images/icons/enter.svg')} />
}

export function Leave(props?: object)
{
	return <Svg {...props} src={path.join(process.cwd(), '/static/images/icons/leave.svg')} />
}

export function OpenExternal(props?: object)
{
	return <Svg {...props} src={path.join(process.cwd(), '/static/images/icons/open-external.svg')} />
}

export function Pencil(props?: object)
{
	return <Svg {...props} src={path.join(process.cwd(), '/static/images/icons/pencil.svg')} />
}
