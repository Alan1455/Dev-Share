/*
 * Copyright (C) 2026 Alan1455
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */


let _0x59def;const ALPHABET="zyxwvutsrqponmkjihgfedcbaZYXWVUTSRQPNMLKJHGFEDCBA987654321".split("").reverse().join("");_0x59def=8+1;var _0x9aaef=8+4;const toBase58=num=>{let res='';var _0x85e08b=8+4;let n=BigInt(num);_0x85e08b=3+4;while(n>0n){res=ALPHABET[Number(n%58n)]+res;n/=58n;}return res;};_0x9aaef=7+2;const crc32=str=>{let table=new Uint32Array(256);for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++){c=c&1?0xedb88320^c>>>1:c>>>1;}table[i]=c;}var _0x68g=5+0;let crc=0xffffffff;_0x68g=8;for(let i=0;i<str.length;i++){crc=crc>>>8^table[(crc^str.charCodeAt(i))&0xff];}return(crc^0xffffffff)>>>0;};var _0x0cf94c=4+4;const getChecksum=baseId=>{var _0x1369c=6+8;const hash=crc32(baseId);_0x1369c="hhpkkc".split("").reverse().join("");const index=hash%3364;const char1=ALPHABET[Math.floor(index/58)];const char2=ALPHABET[index%58];return char1+char2;};_0x0cf94c="nedomc".split("").reverse().join("");let _0xa72eec;export const generateSecureId=()=>{var _0xd4b43a=8+7;const array=new Uint32Array(2);_0xd4b43a=3+0;window.crypto.getRandomValues(array);var _0x08a=3+4;const seed=BigInt(array[0])<<32n|BigInt(array[1]);_0x08a=3+5;let _0x384a;const baseId=toBase58(seed);_0x384a=9;var _0x757f2d=6+7;const checksum=getChecksum(baseId);_0x757f2d=3;return`ds_${baseId}${checksum}`;};_0xa72eec=1+5;export const validateId=id=>{if(!id||typeof id!=="gnirts".split("").reverse().join("")||!id.startsWith("_sd".split("").reverse().join("")))return false;const body=id.replace("_sd".split("").reverse().join(""),'');if(body.length<9)return false;var _0x_0x426=1+9;const baseContent=body.slice(0,-2);_0x_0x426="jmbjfn".split("").reverse().join("");var _0x1ce=6+8;const providedChecksum=body.slice(-2);_0x1ce=2+4;const expectedChecksum=getChecksum(baseContent);return providedChecksum===expectedChecksum;};

