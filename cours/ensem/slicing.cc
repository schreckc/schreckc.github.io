#include <vector>

using namespace std;

vector<double> shape3d_points{
  0.0, 0.0, 0.0, // first point on origin
 30.0, 0.0, 0.0,
 15.0,26.0, 0.0,
 15.0,33.0,30.0 // apex
};

vector<int> shape3d_triangles{
  0,1,3,
  2,3,1,
  2,0,3,
  0,2,1
};

#include <iostream>
#include <fstream>
#include <limits>
#include <cmath>
#include <cassert>
#include <algorithm>
#include <map>


int main()
{
  ofstream f("output.gcode");
  
  const double th = 0.2;
  
  double zmax = - numeric_limits<double>::max();
  for (int i = 0; i < shape3d_points.size(); i += 3) {
    double pz = shape3d_points[i+2];
    zmax = max(zmax,pz);
  }

  /*
  ---------------- 2 th

  ................ th/2 + th
  
  ---------------- th
  
  ................ th/2
  
  ================
  
  */

  // go through slices NOTE: this is not the most efficient way!
  for (double slicing_h = th / 2.0 ; slicing_h < zmax ; slicing_h += th) { // uniform slicing, at mid-height
  
    f << "G0 Z" << slicing_h + th / 2.0 << endl;
  
    // this stores information for an intersection
    // other_tag: the other intersection for the triangle
    typedef struct {
      pair<int,int>        other_tag;
      pair<double,double > coords;
    } intersect_nfo;
  
    map< pair<int,int> , intersect_nfo > all_intersections;
  
    // for each triangle, find intersection segment if any
    for (int tri = 0 ; tri < shape3d_triangles.size() ; tri += 3) {
      
      pair<double,double> intersects[2];
      pair<int,int>       tags[2];
      int num_intersects = 0;
      
      // for each edge
      for (int e0 = 0 ; e0 < 3 ; ++ e0) {        // 0 1 2
        int e1 = (e0 + 1) % 3;                   // 1 2 0
        // indices of two edge points
        int i0 = shape3d_triangles[tri + e0];
        int i1 = shape3d_triangles[tri + e1];
        // get coordinates
        double x0 = shape3d_points[i0*3 + 0];
        double y0 = shape3d_points[i0*3 + 1];
        double z0 = shape3d_points[i0*3 + 2];        
        double x1 = shape3d_points[i1*3 + 0];
        double y1 = shape3d_points[i1*3 + 1];
        double z1 = shape3d_points[i1*3 + 2];        
        // is the edge crossing the slicing plane?
        if (min(z0,z1) < slicing_h && max(z0,z1) >= slicing_h) {
          
          double ix = x0 + (x1 - x0) * (slicing_h - z0) / (z1 - z0);
          double iy = y0 + (y1 - y0) * (slicing_h - z0) / (z1 - z0);

          assert(num_intersects < 2);
          num_intersects = num_intersects + 1;

          int side = (z0 > z1) ? 0 : 1; // this ensures that contour segments
                                        // on triangles all have the same orientation
          intersects[side] = make_pair(ix,iy);
          tags      [side] = make_pair(i0,i1);

        }
      }
      assert(num_intersects == 0 || num_intersects == 2);
      
      if (num_intersects == 2) {
        intersect_nfo nfo;
        nfo.other_tag = tags[1];
        nfo.coords    = intersects[0];
        //                                   vvv key   vvv value
        all_intersections.insert( make_pair( tags[0] , nfo ) ); // insert in map
      }
      
    }
  
    // stitch contour in the slice
    assert(!all_intersections.empty());
    
    auto current = all_intersections.begin();
    pair<int,int> start = current->first;
    
    f << "G0 X" << current->second.coords.first << " Y"  << current->second.coords.second << endl;
    do {
      
      pair<int,int> next;
      next.first  = current->second.other_tag.second;
      next.second = current->second.other_tag.first;
      
      // search next segment (it has to exist!)
      current = all_intersections.find(next);
      assert(current != all_intersections.end());

      // print from previous to next
      f << "G92 E0.0" << endl;
      f << "G1 X" << current->second.coords.first 
          << " Y"  << current->second.coords.second
          << " E0.1" << endl; // TODO: adjust flow
      
    } while( current->first != start );
    
    // TODO: verify we have visited all, as there may be multiple cycles in a slice
    
  }
  
  return 0;
}











