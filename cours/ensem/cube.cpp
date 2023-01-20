#include <iostream>
#include <fstream>
#include <cmath> // use constant M_PI to get the value of pi
int main () {
std::ofstream file;
file.open ("cube.gcode");
// header
file << "G21" << std::endl;// dimensions in milimeters
file << "G90" << std::endl;// absolute positioning
file << "G28" << std::endl;// homing

 int nb_layers = 90;
 float nozzle = 0.4; // nozzle diameter
 float d_fil = 1.75; // filament diameter
 float s_square = 40; // size of the square
 float dz = 0.2; // height of one slice
 float xc = 100, yc = 100; // starting point

 float ss = 4;
 float s = s_square;
 float x0 = xc - s/2.0, y0 = yc - s/2.0; // 
 float x1 = xc - s/2.0, y1 = yc + s/2.0; // 
 float x2 = xc + s/2.0, y2 = yc + s/2.0; //
 float x3 = xc + s/2.0, y3 = yc - s/2.0; // 
 float zcur = dz; // current height
 float ecur = 0.0; // current position of E

 float e_incr;
 float e_mult = nozzle*dz*4.0/(d_fil*d_fil*M_PI);
 // float e_incr2 = ss*nozzle*dz*4.0/(d_fil*d_fil*M_PI);
 float ishift = 2;
 float shift = ishift;
 float shift2 = ss - shift;
 int nb_l = s_square/ss;
 for (uint i = 0; i < nb_layers; ++i) {
   if (ishift > ss) {
     ishift -= ss;
   }
   shift = ishift;
   shift2 = ss - shift;
   
   for (uint j = 0; j < nb_l; ++j) {
     float l = sqrt(2*(s - shift)*(s-shift));
     e_incr = l*e_mult;
     ecur += e_incr;
     file << "G0 X"<<x0<<" Y"<<y0+shift<<" Z"<<zcur<<std::endl;
     file << "G1 X"<<x2 - shift<<" Y"<<y2<<" E"<<ecur<<std::endl;
     shift += ss;
   }
   
   for (uint j = 0; j < nb_l; ++j) {
     float l = sqrt(2*(s - shift2)*(s-shift2));
     e_incr = l*e_mult;
     ecur += e_incr;
     file << "G0 X"<<x2<<" Y"<<y2-shift2<<" Z"<<zcur<<std::endl;
     file << "G1 X"<<x0 + shift2<<" Y"<<y0<<" E"<<ecur<<std::endl;
     shift2 += ss;
   }
   shift = ishift;
   shift2 = ss - shift;
     for (uint j = 0; j < nb_l; ++j) {
     float l = sqrt(2*(s - shift2)*(s-shift2));
     e_incr = l*e_mult;
     ecur += e_incr;
     file << "G0 X"<<x1<<" Y"<<y1-shift2<<" Z"<<zcur<<std::endl;
     file << "G1 X"<<x3-shift2<<" Y"<<y3<<" E"<<ecur<<std::endl;
     shift2 += ss;
   }
     
     for (uint j = 0; j < nb_l; ++j) {
       float l = sqrt(2*(s - shift)*(s-shift));
       e_incr = l*e_mult;
       ecur += e_incr;
       file << "G0 X"<<x3<<" Y"<<y3+shift<<" Z"<<zcur<<std::endl;
       file << "G1 X"<<x1+shift<<" Y"<<y1<<" E"<<ecur<<std::endl;
       shift += ss;
     }

     shift = ishift;
     e_incr = s*e_mult;
   for (uint j = 0; j < nb_l; ++j) {
     ecur += e_incr;
     file << "G0 X"<<x0<<" Y"<<y0+shift<<" Z"<<zcur<<std::endl;
     file << "G1 X"<<x3<<" Y"<<y3+shift<<" E"<<ecur<<std::endl;
     shift += ss;
   }

   // // shift = 2;
   // // e_incr = s*e_mult;
   // // for (uint j = 0; j < nb_l; ++j) {
   // //   ecur += e_incr;
   // //   file << "G0 X"<<x0+shift<<" Y"<<y0<<" Z"<<zcur<<std::endl;
   // //   file << "G1 X"<<x1+shift<<" Y"<<y1<<" E"<<ecur<<std::endl;
   // //   shift += ss;
   // // }
   zcur+=dz;
   ishift += nozzle/2.0;
 }
 file.close();
return 0;
}
