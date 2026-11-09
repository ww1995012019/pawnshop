"""Import original police/visitor busts and offstage wanted faces; keep masters."""
from pathlib import Path
from PIL import Image
from portrait_import import connected_portrait
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'godot/assets/atlas'
def atlas(source_name,output,columns,rows,cell,count,bust):
 source=Image.open(ROOT/'art-source/shop-v3'/source_name).convert('RGBA')
 sheet=Image.new('RGBA',(columns*cell,rows*cell))
 for i in range(count):
  x,y=i%columns,i//columns
  crop=source.crop((round(x*source.width/columns),round(y*source.height/rows),round((x+1)*source.width/columns),round((y+1)*source.height/rows)))
  crop.putalpha(crop.getchannel('A').point(lambda a:255 if a>=160 else 0))
  crop=connected_portrait(crop)
  bounds=crop.getbbox()
  if not bounds:raise ValueError(f'empty portrait {i}')
  crop=crop.crop(bounds)
  limit=116 if bust else 74
  crop.thumbnail((limit,limit),Image.Resampling.LANCZOS)
  crop.putalpha(crop.getchannel('A').point(lambda a:255 if a>=128 else 0))
  crop=connected_portrait(crop).resize((crop.width*2,crop.height*2),Image.Resampling.NEAREST)
  sheet.alpha_composite(crop,(x*cell+(cell-crop.width)//2,y*cell+cell-8-crop.height))
 sheet.save(OUT/f'{output}.png')
 normal=Image.new('RGBA',sheet.size,(128,128,255,0));normal.putalpha(sheet.getchannel('A'));normal.save(OUT/f'{output}_n.png')
 print(output,count,sheet.size)
def main():
 atlas('residents-new-master.png','shop-residents-new',5,4,256,20,True)
 atlas('wanted-faces-master.png','wanted-faces',8,4,160,31,False)
if __name__=='__main__':main()
