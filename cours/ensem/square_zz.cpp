#include <iostream>
#include <fstream>
#include <cmath> // use constant M_PI to get the value of pi
int main () {
std::ofstream file;
file.open ("square_zz.gcode");
// header
file << "G21" << std::endl;// dimensions in milimeters
file << "G90" << std::endl;// absolute positioning
file << "G28" << std::endl;// homing

 int nb_layers = 50;
 float nozzle = 0.4; // nozzle diameter
 float d_fil = 1.75; // filament diameter
 float s_square = 40; // size of the square
 float dz = 0.2; // height of one slice
 float xc = 100, yc = 100; // starting point

 float ss = nozzle;
 float s = s_square - ss;
 float xi = xc - s, yi = yc - s, zi = dz; // starting point
 float zcur = zi; // current height
 float ecur = 0.0; // current position of E

 float e_incr = s*nozzle*dz*4.0/(d_fil*d_fil*M_PI);
 float e_incr2 = ss*nozzle*dz*4.0/(d_fil*d_fil*M_PI);
 
 for (uint i = 0; i < nb_layers; ++i) {
   file << "G0 X"<<xi<<" Y"<<yi<<" Z"<<zcur<<std::endl;
   float xcur = xi;
   int nb_zz = s_square/(2.0*ss);
   for (uint j = 0; j < nb_zz; ++j) {
     ecur += e_incr;
     file << "G1 Y"<<yi+s<<" E"<<ecur<<std::endl;
     xcur += ss;
     ecur += e_incr2;
     file << "G1 X"<<xcur<<" E"<<ecur<<std::endl;
     ecur += e_incr;
     file << "G1 Y"<<yi<<" E"<<ecur<<std::endl;
     xcur += ss;
     ecur += e_incr2;
     file << "G1 X"<<xcur<<" E"<<ecur<<std::endl;
   }
   ecur += e_incr;
   file << "G1 Y"<<yi+s<<" E"<<ecur<<std::endl;
   zcur+=dz;
   
 }
 file.close();
return 0;
}
