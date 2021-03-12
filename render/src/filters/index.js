/*
* author: wancheng
* date: 11/5/18
* desc:
*/

import {SoundFormat, CodecID} from "@/constant/constant";

export {parseTime as parseTimeFilter} from '~/utils';
export {formatPassTime as formatPassTimeFilter} from '@/utils';
export {unitSpeedFormat as unitSpeedFormatFilter} from '@/utils';
export {formatDurationTime as formatDurationTimeFilter} from '@/utils';
export {formatRemainTime as formatRemainTimeFilter} from '@/utils';
export {formatMinTimeTips as formatMinTimeTipsFilter} from '@/utils';

export function soundFormatFilter(soundFormat) {
  return SoundFormat[soundFormat];
}

export function codecIDFilter(codec) {
  return CodecID[codec];
}

export function soundRateFilter(rate) {
  return rate > 1000 ? rate / 1000 + "kHz" : rate + "Hz";

}
