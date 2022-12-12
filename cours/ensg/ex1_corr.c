#include <iostream>
#include <string>

#include <chrono>
#include <thread>
#include <vector>
#include <mutex>
#include <atomic>

using namespace std;

// ----------------------------------------------------------

int fact(int n) {
  int res = 1;
  for (int i = 2; i <= n; ++i) {
    res *= i;
  }
  return res;
}
	 

void fact_tbl(int tbl[], int res[], uint start, uint inc, uint end) {
  for (int i = start; i < end; i += inc) {
    res[i] = fact(tbl[i]);
  }
}

int main()
{

  int tbl[16]    = {0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15};
  int result[16] = {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};

   thread th1(fact_tbl, tbl, result, 0, 2, 16); 
   thread th2(fact_tbl, tbl, result, 1, 2, 16); 
  // fact_tbl(tbl, result, 0, 1, 16);
   th1.join(); 
   th2.join(); 

  for (uint i = 0; i < 16; ++i){
    cerr << result[i]<<" ";
  }
  cerr<<"\n";
  // Ex1: create two threads, use both to compute factorial(tbl[]) => result[]
  // result[i] = factorial(tbl[i])
  
  return 0;
}

// ----------------------------------------------------------
